import requests
import json
import logging

class AETHOS:
    def __init__(self):
        self.logger = logging.getLogger("aethos")
        self.logger.info("Initializing AETHOS...")
        self.fetch_and_generate_data()

    def fetch_code_json(self, url):
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Error fetching data from {url}: {e}")
            return None

    def extract_agency_data(self, agency_info):
        if 'agency' not in agency_info:
            self.logger.warning(f"'agency' key not found in {agency_info}")
            return None

        code_json_url = agency_info['agency'].get('codeUrl')
        if not code_json_url:
            self.logger.warning(f"'codeUrl' not found for agency {agency_info['agency']}")
            return None

        code_data = self.fetch_code_json(code_json_url)
        if not code_data:
            return None

        agency_name = agency_info['agency'].get('name', 'Unknown Agency')
        abbreviation = agency_info['agency'].get('acronym', 'N/A')
        total_projects = len(code_data.get('releases', []))
        repositories = []

        for repo in code_data.get('releases', []):
            repo_data = {
                "name": repo.get('name', ''),
                "description": repo.get('description', ''),
                "repositoryURL": repo.get('repositoryURL', ''),
                "usageType": repo.get('permissions', {}).get('usageType', 'openSource'),
                "tags": repo.get('tags', []),
                "contact": {
                    "name": repo.get('contact', {}).get('name', ''),
                    "email": repo.get('contact', {}).get('email', '')
                },
                "laborHours": repo.get('measurementType', {}).get('laborHours', 0),
                "languages": repo.get('languages', [])
            }
            repositories.append(repo_data)

        return {
            "name": agency_name,
            "abbreviation": abbreviation,
            "total_projects": total_projects,
            "repositories": repositories
        }

    def fetch_and_generate_data(self):
        repos_url = 'https://code.gov/assets/data/filters/repos.json'
        repos_data = self.fetch_code_json(repos_url)

        if not repos_data:
            return

        agencies_info = repos_data.get('agencies', [])
        agencies_list = []

        for agency_info in agencies_info:
            agency_data = self.extract_agency_data(agency_info)
            if agency_data:
                agencies_list.append(agency_data)

        final_data = {"AGENCIES": agencies_list}

        with open('code.json', 'w') as json_file:
            json.dump(final_data, json_file, indent=4)

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    aethos = AETHOS()

