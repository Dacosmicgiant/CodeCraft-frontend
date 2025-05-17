import { ExternalLink, Video, Book, Code, Globe } from 'lucide-react';

const ResourceList = ({ resources }) => {
  if (!resources || resources.length === 0) {
    return null;
  }
  
  // Get icon for the resource based on type
  const getResourceIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video size={16} className="text-red-500" />;
      case 'article':
        return <Book size={16} className="text-blue-500" />;
      case 'documentation':
        return <Code size={16} className="text-purple-500" />;
      case 'tutorial':
        return <Book size={16} className="text-green-500" />;
      case 'website':
        return <Globe size={16} className="text-amber-500" />;
      default:
        return <ExternalLink size={16} className="text-gray-500" />;
    }
  };
  
  return (
    <div className="mt-8 bg-gray-50 border rounded-md p-4">
      <h3 className="text-lg font-bold mb-4">Additional Resources</h3>
      <ul className="space-y-3">
        {resources.map((resource, index) => (
          <li key={index} className="flex">
            <div className="mr-3 mt-0.5">
              {getResourceIcon(resource.type)}
            </div>
            <div>
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline flex items-center"
              >
                {resource.title}
                <ExternalLink size={14} className="ml-1" />
              </a>
              <p className="text-sm text-gray-600">{resource.description}</p>
              {resource.author && (
                <p className="text-xs text-gray-500">By {resource.author}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceList;