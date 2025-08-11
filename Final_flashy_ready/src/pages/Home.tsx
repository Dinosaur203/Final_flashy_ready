import React from 'react';
import { BookOpen, Calendar, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

interface HomeProps {
  onPageChange: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onPageChange }) => {
  const features = [
    {
      icon: BookOpen,
      title: 'Study Tools',
      description: 'Flashcards, notes, quizzes, and Pomodoro timer to enhance your learning experience.',
      color: 'bg-primary-500',
      action: () => onPageChange('study-tools')
    },
    {
      icon: Calendar,
      title: 'Planner',
      description: 'Organize your schedule with calendar, to-do lists, and goal tracking.',
      color: 'bg-secondary-500',
      action: () => onPageChange('planner')
    },
    {
      icon: Heart,
      title: 'Wellness',
      description: 'Mood tracking, study music, and wellness tips for balanced learning.',
      color: 'bg-accent-500',
      action: () => onPageChange('wellness')
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      content: "StudySync transformed my study routine. The flashcards with spaced repetition helped me ace my algorithms exam!",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Pre-med Student",
      content: "The Pomodoro timer and mood tracker keep me focused and balanced. Perfect for intense study sessions.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Psychology Major",
      content: "I love how everything is connected - from notes to calendar to progress tracking. It's like having a personal study assistant.",
      rating: 5
    }
  ];

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Lead Developer",
      bio: "Full-stack developer passionate about creating intuitive learning experiences.",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      name: "Maria Garcia",
      role: "UX Designer",
      bio: "Designer focused on accessible and beautiful interfaces for education.",
      image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      name: "David Kim",
      role: "Education Specialist",
      bio: "Former teacher bringing pedagogical expertise to digital learning tools.",
      image: "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      name: "Sarah Johnson",
      role: "UX Researcher",
      bio: "Specializes in user experience research and accessibility in educational technology.",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    {
      name: "Michael Chen",
      role: "Backend Developer",
      bio: "Full-stack engineer focused on scalable learning management systems.",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-poppins font-bold text-4xl md:text-6xl text-gray-900 dark:text-white mb-6">
            Your Aesthetic
            <span className="text-primary-500"> Study Hub</span>
          </h1>
          <p className="font-inter text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            StudySync brings together all your study tools in one beautiful, organized space. 
            From flashcards to wellness tracking, we've got everything you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => onPageChange('study-tools')}
              className="text-lg px-8 py-4"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => onPageChange('study-tools')}
              className="text-lg px-8 py-4"
            >
              Try Tools
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="font-poppins font-semibold text-3xl text-center text-gray-900 dark:text-white mb-12">
          Everything You Need to Excel
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hover className="text-center">
              <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-poppins font-semibold text-xl text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="font-inter text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {feature.description}
              </p>
              <Button variant="outline" onClick={feature.action}>
                Explore {feature.title}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800 rounded-2xl my-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-poppins font-semibold text-3xl text-center text-gray-900 dark:text-white mb-12">
            What Students Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="font-inter text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-inter font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="font-inter text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <h2 className="font-poppins font-semibold text-3xl text-center text-gray-900 dark:text-white mb-12">
          Meet the Team
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center">
              <img
                src={member.image}
                alt={`${member.name}, ${member.role}`}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                loading="lazy"
              />
              <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-2">
                {member.name}
              </h3>
              <p className="font-inter text-primary-600 dark:text-primary-400 font-medium mb-3">
                {member.role}
              </p>
              <p className="font-inter text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {member.bio}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-12">
          <h2 className="font-poppins font-bold text-3xl text-white mb-4">
            Ready to Transform Your Study Routine?
          </h2>
          <p className="font-inter text-lg text-primary-100 mb-8">
            Join thousands of students who've already improved their learning with StudySync.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => onPageChange('study-tools')}
            className="bg-white text-primary-600 hover:bg-gray-100"
          >
            Start Learning Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;