import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly partnerLogos = ['Google', 'Microsoft', 'Airbnb', 'Stripe', 'Spotify', 'Amazon'];

  protected readonly workflowSteps = [
    {
      title: 'Upload your CV',
      description: 'Drag & drop your CV or import it from LinkedIn. We structure everything automatically.',
      icon: '📄',
      highlights: ['Instant parsing', 'Skill extraction']
    },
    {
      title: 'AI Matching',
      description: 'Our matching engine compares your profile with thousands of curated roles every hour.',
      icon: '🤖',
      highlights: ['Culture fit scoring', 'Realtime alerts']
    },
    {
      title: 'Interview Ready',
      description: 'Get personalized prep packs, salary data, and direct recruiter intros for every match.',
      icon: '💼',
      highlights: ['Live coaching', 'Offer tracking']
    }
  ];

  protected readonly jobMatches = [
    {
      title: 'Frontend Engineer',
      company: 'NovaTech Labs',
      matchScore: 92,
      location: 'Remote · Europe',
      salary: '€65K – €85K',
      type: 'Full-time',
      tags: ['Angular', 'TypeScript', 'AI UI']
    },
    {
      title: 'Product Designer',
      company: 'Pulse AI',
      matchScore: 88,
      location: 'Berlin, Germany',
      salary: '€55K – €72K',
      type: 'Hybrid',
      tags: ['Figma', 'Design Systems', 'Motion']
    },
    {
      title: 'Data Scientist',
      company: 'Northwind Insights',
      matchScore: 85,
      location: 'Paris, France',
      salary: '€70K – €95K',
      type: 'Full-time',
      tags: ['Python', 'LLMs', 'MLOps']
    }
  ];

  protected readonly testimonials = [
    {
      quote: 'JobLink matched me with a role that aligned with my growth plan in under a week. The prep resources were gold.',
      author: 'Lina Chen',
      role: 'Associate PM',
      company: 'Orbit Apps',
      initials: 'LC'
    },
    {
      quote: 'The AI insights and recruiter chat combined saved me dozens of hours. I signed an offer 20% above my target.',
      author: 'Marc Ben Khaled',
      role: 'Full-stack Engineer',
      company: 'HelioCloud',
      initials: 'MB'
    },
    {
      quote: 'As a career switcher, I loved how JobLink highlighted transferable skills and sent curated matches every morning.',
      author: 'Sara Dubois',
      role: 'UX Researcher',
      company: 'Brightline',
      initials: 'SD'
    }
  ];
}
