import { useState } from 'react'

export default function AethosSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/aethos/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error searching AETHOS:', error)
    }
    setLoading(false)
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your search query"
          className="w-full py-2 px-4 bg-[#EDF2F7] dark:bg-[#4A5568] text-[#2D3748] dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {results.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Search Results:</h3>
          <ul className="space-y-4">
            {results.map((result, index) => (
              <li key={index} className="bg-[#EDF2F7] dark:bg-[#4A5568] p-4 rounded-md">
                <h4 className="text-lg font-semibold">{result.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{result.description}</p>
                <p className="text-sm"><strong>Agency:</strong> {result.agency}</p>
                <p className="text-sm"><strong>URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{result.url}</a></p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-semibold">Code Components</summary>
                  <ul className="pl-4 mt-2 space-y-1">
                    {Object.entries(result.code_components).map(([type, components]) => (
                      <li key={type} className="text-sm">
                        <strong>{type}:</strong> {components.slice(0, 5).join(', ')}{components.length > 5 ? '...' : ''}
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}