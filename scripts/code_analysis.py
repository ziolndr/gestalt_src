# code_analysis.py

import sys
import json
import os
from github import Github
import torch
from transformers import AutoTokenizer, AutoModel

# Initialize the model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("microsoft/codebert-base")
model = AutoModel.from_pretrained("microsoft/codebert-base")

# Initialize GitHub client
g = Github(os.getenv('GITHUB_TOKEN'))

def fetch_github_repo_contents(repo_url):
    try:
        _, _, owner, repo_name = repo_url.rstrip('/').rsplit('/', 3)
        repo = g.get_repo(f"{owner}/{repo_name}")
        return traverse_repo_contents(repo)
    except Exception as e:
        print(f"Error fetching repo contents for {repo_url}: {str(e)}", file=sys.stderr)
        return []

def traverse_repo_contents(repo, path=""):
    contents = repo.get_contents(path)
    code_files = []
    for content in contents:
        if content.type == "dir":
            code_files.extend(traverse_repo_contents(repo, content.path))
        elif content.name.endswith(('.py', '.js', '.java', '.cpp', '.c', '.h', '.cs', '.go', '.rb', '.php')):
            code_files.append({
                'name': content.name,
                'path': content.path,
                'content': content.decoded_content.decode('utf-8')
            })
    return code_files

def preprocess_code(code):
    # Simple preprocessing: remove comments and extra whitespace
    lines = code.split('\n')
    cleaned_lines = [line.split('#')[0].strip() for line in lines]
    return ' '.join(cleaned_lines)

def encode_for_model(query, code):
    inputs = tokenizer(query, code, return_tensors="pt", padding=True, truncation=True, max_length=512)
    return inputs

def get_embedding(inputs):
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1)

def calculate_similarity(query_embedding, code_embedding):
    return torch.nn.functional.cosine_similarity(query_embedding, code_embedding, dim=1).item()

def analyze_code(query, code_files):
    query_inputs = encode_for_model(query, query)
    query_embedding = get_embedding(query_inputs)
    
    results = []
    for file in code_files:
        preprocessed_code = preprocess_code(file['content'])
        code_inputs = encode_for_model(query, preprocessed_code)
        code_embedding = get_embedding(code_inputs)
        similarity = calculate_similarity(query_embedding, code_embedding)
        
        if similarity > 0.5:  # Adjust this threshold as needed
            results.append({
                'file_name': file['name'],
                'file_path': file['path'],
                'code_snippet': file['content'][:500],  # First 500 characters as a snippet
                'similarity': similarity
            })
    
    return results

def analyze_repositories(repositories, query):
    all_results = []
    for repo in repositories:
        try:
            code_files = fetch_github_repo_contents(repo['repositoryURL'])
            repo_results = analyze_code(query, code_files)
            for result in repo_results:
                result['repository'] = repo['name']
                result['agency'] = repo['agency']
                result['repositoryURL'] = repo['repositoryURL']
            all_results.extend(repo_results)
        except Exception as e:
            print(f"Error analyzing repository {repo['name']}: {str(e)}", file=sys.stderr)
    return all_results

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Invalid number of arguments"}))
        sys.exit(1)
    
    repo_file_path = sys.argv[1]
    query = sys.argv[2]
    
    try:
        with open(repo_file_path, 'r') as f:
            repositories = json.load(f)
        
        print(json.dumps({"debug": f"Received {len(repositories)} repositories and query: {query}"}), file=sys.stderr)
        
        results = analyze_repositories(repositories, query)
        sorted_results = sorted(results, key=lambda x: x['similarity'], reverse=True)
        print(json.dumps(sorted_results))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
