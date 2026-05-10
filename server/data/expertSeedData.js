const formatDate = (date) => date.toISOString().split("T")[0];

const getFutureDate = (offsetDays) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return formatDate(date);
};

const expertSeedData = [
  {
    name: "Maya Fernandez",
    category: "Fitness Coach",
    experience: 11,
    rating: 4.8,
    bio: "Performance-focused fitness coach helping busy professionals build sustainable strength, mobility, and energy routines.",
    profileImage: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
    availableSlots: [
      { date: getFutureDate(1), slots: ["07:30 AM", "09:00 AM", "06:00 PM"] },
      { date: getFutureDate(3), slots: ["08:00 AM", "12:30 PM", "05:30 PM"] },
    ],
  },
  {
    name: "Dr. Aisha Mehra",
    category: "Career Mentor",
    experience: 12,
    rating: 4.9,
    bio: "Executive career mentor helping professionals navigate leadership transitions, salary negotiations, and long-term growth strategies.",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    availableSlots: [
      { date: getFutureDate(1), slots: ["10:00 AM", "11:30 AM", "03:00 PM"] },
      { date: getFutureDate(2), slots: ["09:30 AM", "01:00 PM", "04:30 PM"] },
    ],
  },
  {
    name: "Rahul Verma",
    category: "Software Engineer",
    experience: 10,
    rating: 4.8,
    bio: "Principal software engineer specializing in scalable backend systems, cloud migrations, and architecture reviews for fast-growing startups.",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    availableSlots: [
      { date: getFutureDate(1), slots: ["12:00 PM", "02:00 PM", "06:00 PM"] },
      { date: getFutureDate(3), slots: ["10:30 AM", "03:30 PM", "05:30 PM"] },
    ],
  },
  {
    name: "Sara Thomas",
    category: "UI/UX Consultant",
    experience: 8,
    rating: 4.6,
    bio: "UI/UX consultant focused on portfolio reviews, user research strategy, design systems, and product usability for digital experiences.",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    availableSlots: [
      { date: getFutureDate(3), slots: ["10:00 AM", "01:00 PM", "04:00 PM"] },
      { date: getFutureDate(6), slots: ["11:30 AM", "02:00 PM", "06:30 PM"] },
    ],
  },
  {
    name: "Arjun Sen",
    category: "Finance Advisor",
    experience: 14,
    rating: 4.9,
    bio: "Finance advisor supporting founders and operators with fundraising readiness, financial modeling, and strategic planning for growth.",
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    availableSlots: [
      { date: getFutureDate(1), slots: ["09:00 AM", "01:30 PM", "07:00 PM"] },
      { date: getFutureDate(5), slots: ["10:00 AM", "12:00 PM", "03:00 PM"] },
    ],
  },
];

module.exports = expertSeedData;
