import React, { useState } from 'react';
import { ExternalLink, Bookmark, BookmarkCheck, Search, Filter } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { Resource } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Resources: React.FC = () => {
  const [savedResources, setSavedResources] = useLocalStorage<string[]>('studysync_saved_resources', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const resources: Resource[] = [
    // Educational Courses
    {
      id: 'mit-ocw',
      title: 'MIT OpenCourseWare',
      description: 'Free lecture notes, exams, and videos from MIT. Over 2,400 courses covering all subjects.',
      url: 'https://ocw.mit.edu/',
      thumbnail: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'courses',
      saved: false
    },
    {
      id: 'yale-courses',
      title: 'Open Yale Courses',
      description: 'Free courses and lectures from Yale University professors. High-quality video lectures and materials.',
      url: 'https://oyc.yale.edu/',
      thumbnail: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'courses',
      saved: false
    },
    {
      id: 'coursera-free',
      title: 'Coursera Free Courses',
      description: 'Browse thousands of free courses from top universities and companies worldwide.',
      url: 'https://www.coursera.org/courses?query=free',
      thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'courses',
      saved: false
    },
    
    // Books & Reading
    {
      id: 'project-gutenberg',
      title: 'Project Gutenberg',
      description: 'Over 70,000 free eBooks in multiple formats. Classic literature and academic texts.',
      url: 'https://www.gutenberg.org/',
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'books',
      saved: false
    },
    {
      id: 'open-library',
      title: 'Open Library',
      description: 'Borrow and read over 1.7 million books. Digital lending library with academic resources.',
      url: 'https://openlibrary.org/',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'books',
      saved: false
    },
    
    // Study Tools & Templates
    {
      id: 'canva-student',
      title: 'Canva Student Planner Templates',
      description: 'Beautiful, customizable planner templates designed for students. Free to download and edit.',
      url: 'https://www.canva.com/planners/templates/student/',
      thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'templates',
      saved: false
    },
    {
      id: 'notion-templates',
      title: 'Notion Study Templates',
      description: 'Comprehensive study planner templates for Notion. Includes task tracking and note organization.',
      url: 'https://www.notion.so/templates/category/school',
      thumbnail: 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'templates',
      saved: false
    },
    
    // Music & Focus
    {
      id: 'free-music-archive',
      title: 'Free Music Archive',
      description: 'Royalty-free music perfect for studying. Curated collections of ambient and focus music.',
      url: 'https://freemusicarchive.org/',
      thumbnail: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'music',
      saved: false
    }
  ];

  const toggleSave = (resourceId: string) => {
    setSavedResources(prev => 
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const filteredResources = resources
    .map(resource => ({ ...resource, saved: savedResources.includes(resource.id) }))
    .filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || resource.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'courses', name: 'Courses' },
    { id: 'books', name: 'Books' },
    { id: 'templates', name: 'Templates' },
    { id: 'music', name: 'Music' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-poppins font-bold text-3xl text-gray-900 dark:text-white mb-4">
          Learning Resources
        </h1>
        <p className="font-inter text-gray-600 dark:text-gray-300 text-lg">
          Curated collection of educational resources to enhance your learning
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="max-w-md"
          />
        </div>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Saved Resources Summary */}
      {savedResources.length > 0 && (
        <Card className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white">
                Saved Resources
              </h3>
              <p className="font-inter text-gray-600 dark:text-gray-300">
                You have {savedResources.length} saved resource{savedResources.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setFilterCategory('all')}
            >
              View All Saved
            </Button>
          </div>
        </Card>
      )}

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} hover>
            <div className="relative mb-4">
              <img
                src={resource.thumbnail}
                alt={resource.title}
                className="w-full h-48 object-cover rounded-lg"
                loading="lazy"
              />
              <div className="absolute top-3 right-3">
                <Button
                  variant={resource.saved ? 'primary' : 'outline'}
                  size="sm"
                  icon={resource.saved ? BookmarkCheck : Bookmark}
                  onClick={() => toggleSave(resource.id)}
                  className={resource.saved ? 'bg-primary-500 text-white' : 'bg-white/90 backdrop-blur-sm'}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="font-inter text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {resource.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-inter bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 capitalize">
                  {resource.category}
                </span>
                
                <Button
                  size="sm"
                  icon={ExternalLink}
                  onClick={() => window.open(resource.url, '_blank')}
                  className="flex items-center space-x-1"
                >
                  <span>Visit</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-2">
            No resources found
          </h3>
          <p className="font-inter text-gray-600 dark:text-gray-300">
            Try adjusting your search terms or filters
          </p>
        </Card>
      )}

      {/* Resource Categories Info */}
      <Card className="mt-12">
        <h3 className="font-poppins font-semibold text-xl text-gray-900 dark:text-white mb-6">
          Resource Categories
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="font-inter font-semibold text-primary-600 dark:text-primary-400 mb-2">
              📚 Courses
            </h4>
            <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
              Free university courses, lectures, and educational content from top institutions worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-inter font-semibold text-secondary-600 dark:text-secondary-400 mb-2">
              📖 Books & eBooks
            </h4>
            <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
              Digital libraries with millions of books, academic papers, and reference materials.
            </p>
          </div>
          <div>
            <h4 className="font-inter font-semibold text-accent-600 dark:text-accent-400 mb-2">
              📋 Templates
            </h4>
            <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
              Study planners, note templates, and organizational tools to boost your productivity.
            </p>
          </div>
          <div>
            <h4 className="font-inter font-semibold text-blue-600 dark:text-blue-400 mb-2">
              🎵 Study Music
            </h4>
            <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
              Curated playlists and ambient sounds to help you focus during study sessions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Resources;