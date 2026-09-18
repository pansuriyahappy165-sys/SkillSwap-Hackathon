import { useEffect, useRef, useState } from 'react';
import api from './services/api';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  college: '',
  bio: '',
};

const demoStudents = [
  { id: 'maya', name: 'Maya Patel', college: 'Design Institute', department: 'Interaction Design', availability: 'Weekday evenings', skills: [{ id: 'maya-1', name: 'UI/UX', level: 'Advanced' }, { id: 'maya-2', name: 'Canva', level: 'Advanced' }] },
  { id: 'arjun', name: 'Arjun Mehta', college: 'Tech University', department: 'Computer Science', availability: 'Mon, Wed & Fri', skills: [{ id: 'arjun-1', name: 'React', level: 'Advanced' }, { id: 'arjun-2', name: 'JavaScript', level: 'Intermediate' }] },
  { id: 'zoe', name: 'Zoe Williams', college: 'Central College', department: 'English Literature', availability: 'Weekend mornings', skills: [{ id: 'zoe-1', name: 'English', level: 'Advanced' }, { id: 'zoe-2', name: 'Public Speaking', level: 'Intermediate' }] },
  { id: 'dev', name: 'Dev Sharma', college: 'Engineering College', department: 'Data Science', availability: 'Tue & Thu afternoons', skills: [{ id: 'dev-1', name: 'Python', level: 'Advanced' }, { id: 'dev-2', name: 'Data Analysis', level: 'Intermediate' }] },
  { id: 'sofia', name: 'Sofia Garcia', college: 'Creative Arts University', department: 'Visual Communication', availability: 'Weekday mornings', skills: [{ id: 'sofia-1', name: 'Canva', level: 'Advanced' }, { id: 'sofia-2', name: 'Branding', level: 'Intermediate' }] },
  { id: 'liam', name: 'Liam Chen', college: 'City University', department: 'Software Engineering', availability: 'Saturday afternoons', skills: [{ id: 'liam-1', name: 'Java', level: 'Advanced' }, { id: 'liam-2', name: 'Algorithms', level: 'Intermediate' }] },
];

const demoCommunitySkills = [
  { id: 'skill-react', user_id: 'arjun', user_name: 'Arjun Mehta', name: 'React', category: 'Development', description: 'Building clean, responsive web interfaces.' },
  { id: 'skill-python', user_id: 'dev', user_name: 'Dev Sharma', name: 'Python', category: 'Programming', description: 'From fundamentals to practical automation.' },
  { id: 'skill-canva', user_id: 'sofia', user_name: 'Sofia Garcia', name: 'Canva', category: 'Design', description: 'Creating polished social and presentation assets.' },
  { id: 'skill-java', user_id: 'liam', user_name: 'Liam Chen', name: 'Java', category: 'Programming', description: 'Object-oriented programming and problem solving.' },
  { id: 'skill-uiux', user_id: 'maya', user_name: 'Maya Patel', name: 'UI/UX', category: 'Design', description: 'Friendly interfaces, wireframes, and user flows.' },
  { id: 'skill-english', user_id: 'zoe', user_name: 'Zoe Williams', name: 'English', category: 'Language', description: 'Writing confidence and conversational practice.' },
];

const exploreSkills = [
  { id: 'explore-react', user_id: 'arjun', user_name: 'Arjun Mehta', name: 'React Development', category: 'Technical', students: 128, description: 'Build modern, responsive interfaces with React, component patterns, and practical projects.', icon: '</>' },
  { id: 'explore-uiux', user_id: 'maya', user_name: 'Maya Patel', name: 'UI/UX Design', category: 'Creative', students: 96, description: 'Learn user flows, wireframes, visual hierarchy, and thoughtful product design.', icon: '✦' },
  { id: 'explore-python', user_id: 'dev', user_name: 'Dev Sharma', name: 'Python Programming', category: 'Technical', students: 114, description: 'Practice Python fundamentals, automation, and data-focused problem solving.', icon: 'Py' },
  { id: 'explore-graphic', user_id: 'sofia', user_name: 'Sofia Garcia', name: 'Graphic Design', category: 'Creative', students: 82, description: 'Improve composition, branding, color, and polished visual communication.', icon: '✎' },
  { id: 'explore-english', user_id: 'zoe', user_name: 'Zoe Williams', name: 'English Speaking', category: 'Language', students: 143, description: 'Build confidence in conversation, presentations, vocabulary, and public speaking.', icon: 'Aa' },
];

const demoRequests = [];

const demoChats = [
  { id: 'riya', name: 'Riya Shah', avatar: 'RS', lastMessage: 'That sounds great! Let us connect soon.', time: '10:42 AM', messages: [{ id: 'riya-1', from: 'them', text: 'Hey! I would love to learn React from you.', time: '10:40 AM' }, { id: 'riya-2', from: 'me', text: 'That sounds great! Let us connect soon.', time: '10:42 AM' }] },
  { id: 'aarav', name: 'Aarav Patel', avatar: 'AP', lastMessage: 'Can you share your design notes?', time: 'Yesterday', messages: [{ id: 'aarav-1', from: 'them', text: 'Can you share your design notes?', time: 'Yesterday' }] },
  { id: 'neha', name: 'Neha Soni', avatar: 'NS', lastMessage: 'Thanks for the Python tips!', time: 'Mon', messages: [{ id: 'neha-1', from: 'me', text: 'Happy to help with Python practice.', time: 'Mon' }] },
  { id: 'krisha', name: 'Krisha Mehta', avatar: 'KM', lastMessage: 'See you at the workshop.', time: 'Sun', messages: [{ id: 'krisha-1', from: 'them', text: 'See you at the workshop.', time: 'Sun' }] },
  { id: 'meet', name: 'Meet Jani', avatar: 'MJ', lastMessage: 'I can help with JavaScript.', time: 'Sat', messages: [{ id: 'meet-1', from: 'them', text: 'I can help with JavaScript.', time: 'Sat' }] },
];

const getStoredPostedSkills = () => {
  try {
    const savedSkills = JSON.parse(localStorage.getItem('skillswap-posted-skills') || '[]');
    return Array.isArray(savedSkills) ? savedSkills : [];
  } catch {
    return [];
  }
};

const getStoredRequests = () => {
  try {
    const savedRequests = JSON.parse(localStorage.getItem('skillswap-swap-requests') || 'null');
    if (Array.isArray(savedRequests)) return savedRequests;
    localStorage.setItem('skillswap-swap-requests', JSON.stringify(demoRequests));
    return demoRequests;
  } catch {
    return demoRequests;
  }
};

const defaultProfile = {
  name: 'Alex Johnson',
  email: 'alex@college.edu',
  department: 'iMSC(IT)',
  skillsOffered: 'React, JavaScript',
  skillsWanted: 'UI/UX, Python',
  availability: 'Weekday evenings',
};

const translations = {
  English: { about: 'About', settings: 'Settings', dashboard: 'Dashboard', logout: 'Logout', addSkill: 'Add Skill', mySkills: 'My Skills', communitySkills: 'Community Skills', swapRequests: 'Swap Requests', students: 'Students', notifications: 'Notifications' },
  Gujarati: { about: 'અમારા વિશે', settings: 'સેટિંગ્સ', dashboard: 'ડેશબોર્ડ', logout: 'લૉગઆઉટ', addSkill: 'સ્કિલ ઉમેરો', mySkills: 'મારી સ્કિલ્સ', communitySkills: 'કોમ્યુનિટી સ્કિલ્સ', swapRequests: 'સ્વેપ રિક્વેસ્ટ', students: 'વિદ્યાર્થીઓ', notifications: 'નોટિફિકેશન' },
  Hindi: { about: 'हमारे बारे में', settings: 'सेटिंग्स', dashboard: 'डैशबोर्ड', logout: 'लॉगआउट', addSkill: 'स्किल जोड़ें', mySkills: 'मेरी स्किल्स', communitySkills: 'कम्युनिटी स्किल्स', swapRequests: 'स्वैप रिक्वेस्ट', students: 'स्टूडेंट्स', notifications: 'नोटिफिकेशन' },
};

function App() {
  const [authMode, setAuthMode] = useState('landing');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
  const timer = setTimeout(() => {
    setShowSplash(false);
  }, 2500);

  return () => clearTimeout(timer);
}, []);
  const [dashboardView, setDashboardView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState("home");
  const [profile, setProfile] = useState(() => {
  try {
    const savedProfile = JSON.parse(localStorage.getItem("skillswap-profile") || "null");
    return savedProfile || {
      ...defaultProfile,
      name: user?.name || defaultProfile.name,
      email: user?.email || defaultProfile.email,
      profilePublic: true,
    };
  } catch {
    return { ...defaultProfile, profilePublic: true };
  }
});


  const [settings, setSettings] = useState(() => {
    return JSON.parse(localStorage.getItem("skillswap-settings")) || {
      notifications: true,
      language: "English",
      darkMode: false,
    };
  });
  const [accountForm, setAccountForm] = useState(() => {
    try {
      const savedAccount = JSON.parse(localStorage.getItem('skillswap-account') || 'null');
      return savedAccount || {
        name: user?.name || defaultProfile.name,
        email: user?.email || defaultProfile.email,
        department: defaultProfile.department,
        college: user?.college || 'JG University',
        availability: defaultProfile.availability,
      };
    } catch {
      return { name: defaultProfile.name, email: defaultProfile.email, department: defaultProfile.department, college: 'JG University', availability: defaultProfile.availability };
    }
  });
  const [privacySettings, setPrivacySettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('skillswap-privacy-settings') || 'null') || { profilePublic: true, twoFactorEnabled: false };
    } catch {
      return { profilePublic: true, twoFactorEnabled: false };
    }
  });
  const t = translations[settings.language];
  const [users, setUsers] = useState(demoStudents);
  const [postedSkills, setPostedSkills] = useState(getStoredPostedSkills);
  const [skills, setSkills] = useState(() => [...demoCommunitySkills, ...getStoredPostedSkills()]);
  const [requests, setRequests] = useState(getStoredRequests);
  const [form, setForm] = useState(initialForm);
  const [skillForm, setSkillForm] = useState({ name: '', category: '', level: '', description: '' });
  const [mySkills, setMySkills] = useState(() => JSON.parse(localStorage.getItem('skillswap-my-skills') || '[]'));
  const [studentSearch, setStudentSearch] = useState('');
  const [communitySearch, setCommunitySearch] = useState('');
  const [exploreSearch, setExploreSearch] = useState('');
  const [exploreCategory, setExploreCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [postForm, setPostForm] = useState({ mode: 'teach', name: '', description: '', category: 'Technical', tags: '', image: '' });
  const [chats, setChats] = useState(() => {
    try {
      const savedChats = JSON.parse(localStorage.getItem('skillswap-chats') || 'null');
      return Array.isArray(savedChats) ? savedChats : demoChats;
    } catch {
      return demoChats;
    }
  });
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chatSearch, setChatSearch] = useState('');
  const [messageDraft, setMessageDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "🎉 Welcome to SkillSwap AI!", read: false },
    { id: 2, text: "📚 Arjun Mehta added a React skill.", read: false },
    { id: 3, text: "🔄 Maya Patel sent you a swap request.", read: false },
  ]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const isForgotPassword = authMode === 'forgot';

  // Load the dashboard data after login.
  const fetchDashboard = async () => {
    if (!token) return;
    if (token === 'skillswap-demo-token') {
      setUsers(demoStudents);
      setSkills([...demoCommunitySkills, ...getStoredPostedSkills()]);
      setRequests(getStoredRequests());
      return;
    }

    try {
      const [usersRes, skillsRes, requestsRes, profileRes] = await Promise.all([
        api.get('/users'),
        api.get('/skills'),
        api.get('/requests'),
        api.get('/auth/me'),
      ]);

      setUsers(usersRes.data || []);
      setSkills(skillsRes.data || []);
      setRequests(requestsRes.data || []);
      setUser(profileRes.data.user);
      localStorage.setItem('user', JSON.stringify(profileRes.data.user));
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
      setError('Could not load the dashboard. Please try again.');
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token]);

  useEffect(() => {
  if (showToast) {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [showToast]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillFieldChange = (event) => {
    const { name, value } = event.target;
    setSkillForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (authMode === 'login') {
      const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

      if (!hasValidEmail || form.password.length < 6) {
        setError('Enter a valid email and a password with at least 6 characters.');
        setLoading(false);
        return;
      }

      const savedAccount = JSON.parse(localStorage.getItem('skillswap-demo-account') || 'null');
      const demoUser = savedAccount?.email === form.email ? {
        id: savedAccount.id,
        name: savedAccount.name,
        email: savedAccount.email,
        college: savedAccount.college,
        bio: savedAccount.bio,
      } : {
        id: 'demo-user',
        name: form.email.split('@')[0].replace(/[._-]/g, ' '),
        email: form.email,
        college: 'SkillSwap community',
        bio: 'Exploring new skills with SkillSwap AI.',
      };

      localStorage.setItem('token', 'skillswap-demo-token');
      localStorage.setItem('user', JSON.stringify(demoUser));
      setUser(demoUser);
      setToken('skillswap-demo-token');
      setForm(initialForm);
      setLoading(false);
      return;
    }

    const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    if (!form.name.trim() || !hasValidEmail || form.password.length < 6) {
      setError('Enter your full name, a valid email, and a password with at least 6 characters.');
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      setLoading(false);
      return;
    }

    const demoUser = {
      id: `demo-${Date.now()}`,
      name: form.name.trim(),
      email: form.email,
      college: form.college.trim() || 'SkillSwap community',
      bio: 'Ready to learn, teach, and trade skills.',
    };

    localStorage.setItem('skillswap-demo-account', JSON.stringify({ ...demoUser, password: form.password }));
    localStorage.setItem('token', 'skillswap-demo-token');
    localStorage.setItem('user', JSON.stringify(demoUser));
    setUser(demoUser);
    setToken('skillswap-demo-token');
    setForm(initialForm);
    setLoading(false);
  };

  const handleResetSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSuccess('If an account exists for that email, a reset link is on its way.');
  };

  const changeAuthPage = (mode) => {
    setAuthMode(mode);
    setError('');
    setSuccess('');
  };

  const handleSkillSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const newSkill = { id: `my-skill-${Date.now()}`, ...skillForm };
    const updatedSkills = [newSkill, ...mySkills];
    setMySkills(updatedSkills);
    localStorage.setItem('skillswap-my-skills', JSON.stringify(updatedSkills));
    setSkillForm({ name: '', category: '', level: '', description: '' });
    setSuccess('Skill added to your profile!');
  };

  const handlePostFieldChange = (event) => {
    const { name, value } = event.target;
    setPostForm((previousForm) => ({ ...previousForm, [name]: value }));
  };

  const handlePostImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPostForm((previousForm) => ({ ...previousForm, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handlePostSkill = (event) => {
    event.preventDefault();
    const postedSkill = {
      id: `posted-${Date.now()}`,
      user_id: user.id,
      user_name: user.name || 'You',
      name: postForm.name.trim(),
      category: postForm.category,
      description: postForm.description.trim() || 'A new skill shared with the SkillSwap community.',
      tags: postForm.tags.trim(),
      image: postForm.image,
      students: 1,
      icon: postForm.category === 'Technical' ? '</>' : postForm.category === 'Creative' ? '✦' : 'Aa',
    };
    const updatedPostedSkills = [postedSkill, ...postedSkills];
    setPostedSkills(updatedPostedSkills);
    setSkills((previousSkills) => [postedSkill, ...previousSkills]);
    localStorage.setItem('skillswap-posted-skills', JSON.stringify(updatedPostedSkills));
    setPostForm({ mode: 'teach', name: '', description: '', category: 'Technical', tags: '', image: '' });
    setToastMessage('Skill posted successfully!');
    setShowToast(true);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const text = messageDraft.trim();
    if (!text || !selectedChatId) return;
    const newMessage = { id: `message-${Date.now()}`, from: 'me', text, time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) };
    setChats((previousChats) => {
      const updatedChats = previousChats.map((chat) => chat.id === selectedChatId
        ? { ...chat, lastMessage: text, time: 'Now', messages: [...chat.messages, newMessage] }
        : chat);
      localStorage.setItem('skillswap-chats', JSON.stringify(updatedChats));
      return updatedChats;
    });
    setMessageDraft('');
  };

  const handleRequestSwap = async (selectedSkill) => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (token === 'skillswap-demo-token') {
      const newRequest = {
        id: `request-${Date.now()}`,
        requester_name: 'You',
        target_name: selectedSkill.user_name,
        skill_offered: selectedSkill.name,
        skill_wanted: 'Your skill',
        message: `You requested a skill swap with ${selectedSkill.user_name} for ${selectedSkill.name}.`,
        status: 'Pending',
      };
      setRequests((prev) => {
        const updatedRequests = [...prev, newRequest];
        localStorage.setItem('skillswap-swap-requests', JSON.stringify(updatedRequests));
        return updatedRequests;
      });
      setSuccess("Demo swap request sent!");

if (settings.notifications) {
  setToastMessage(`Swap request sent to ${selectedSkill.user_name}! 🎉`);
  setShowToast(true);
}
if (settings.notifications) {
  setNotifications((prev) => [
    {
      id: Date.now(),
      text: `📩 Swap request sent to ${selectedSkill.user_name} for ${selectedSkill.name}.`,
      read: false,
    },
    ...prev,
  ]);

  setShowNotifications(true);   // ⭐ AA LINE ADD KARO
}

setTimeout(() => {
  setShowToast(false);
}, 3000);
      
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/requests', {
        targetId: selectedSkill.user_id,
        message: 'Hi! I would like to swap skills with you.',
      });

      setRequests((prev) => {
        const updatedRequests = [...prev, response.data];
        localStorage.setItem('skillswap-swap-requests', JSON.stringify(updatedRequests));
        return updatedRequests;
      });
      setSuccess('Swap request sent successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send swap request.');
    } finally {
      setLoading(false);
    }
  };

  const openExploreSkill = (skill) => {
    setSelectedSkill(skill);
    setDashboardView('skillDetails');
  };

  const handleExploreRequest = async () => {
    if (!selectedSkill) return;
    await handleRequestSwap(selectedSkill);
    setDashboardView('dashboard');
    window.setTimeout(() => document.getElementById('swap-requests')?.scrollIntoView({ behavior: 'smooth' }), 0);
  };

 const handleRequestDecision = (requestId, status) => {
  const updatedRequests = requests.map((request) =>
    request.id === requestId
      ? { ...request, status }
      : request
  );

  setRequests(updatedRequests);
  localStorage.setItem(
    "skillswap-swap-requests",
    JSON.stringify(updatedRequests)
  );

  if (settings.notifications) {
  setToastMessage(`🎉 Swap request ${status}!`);
  setShowToast(true);

  setNotifications((prev) => [
    {
      id: Date.now(),
      text: `🎉 Swap request ${status}!`,
      read: false,
    },
    ...prev,
  ]);
}

setSuccess(`Swap request ${status}!`);
};

  const handleClearSwapRequests = () => {
    setRequests([]);
    localStorage.setItem('skillswap-swap-requests', JSON.stringify([]));
  };

  const handleClearMySkills = () => {
    setMySkills([]);
    localStorage.removeItem('skillswap-my-skills');
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: name === 'profilePublic' ? value === 'true' : value,
    }));
  };

  const handleSettingsChange = (e) => {
  const { name, value, checked, type } = e.target;

  const newSettings = {
    ...settings,
    [name]: type === "checkbox" ? checked : value,
  };

  setSettings(newSettings);

  // Notifications OFF thai to bell bandh ane list clear
  if (name === "notifications" && checked === false) {
    setShowNotifications(false);
    setNotifications([]);
  }
};

const handleSettingsSave = () => {
  localStorage.setItem("skillswap-settings", JSON.stringify(settings));

  if (!settings.notifications) {
    setShowNotifications(false);
    setNotifications([]);
  }

  setSuccess("Settings saved successfully!");
  setToastMessage("Settings saved successfully!");
  setShowToast(true);
};

const handleProfileDarkModeToggle = () => {
  setSettings((previousSettings) => {
    const updatedSettings = { ...previousSettings, darkMode: !previousSettings.darkMode };
    localStorage.setItem('skillswap-settings', JSON.stringify(updatedSettings));
    return updatedSettings;
  });
};

const handleProfileSave = (event) => {
  event.preventDefault();

  const savedProfile = JSON.parse(localStorage.getItem('skillswap-profile') || 'null');

  localStorage.setItem("skillswap-profile", JSON.stringify(profile));

  const updatedUser = {
    ...user,
    name: profile.name,
    email: profile.email,
  };

  localStorage.setItem("user", JSON.stringify(updatedUser));
  setUser(updatedUser);
  setSuccess(savedProfile?.profilePublic !== profile.profilePublic
    ? "Profile visibility updated successfully!"
    : "Profile changes saved!");
};

const handleAccountSave = (event, nextAccount = accountForm) => {
  event.preventDefault();
  localStorage.setItem('skillswap-account', JSON.stringify(nextAccount));
  setAccountForm(nextAccount);
  setProfile((previousProfile) => ({ ...previousProfile, ...nextAccount }));
  const updatedUser = { ...user, name: nextAccount.name, email: nextAccount.email, college: nextAccount.college };
  setUser(updatedUser);
  localStorage.setItem('user', JSON.stringify(updatedUser));
  setToastMessage('Account details updated successfully!');
  setShowToast(true);
};

const handlePrivacySave = (nextPrivacySettings) => {
  setPrivacySettings(nextPrivacySettings);
  localStorage.setItem('skillswap-privacy-settings', JSON.stringify(nextPrivacySettings));
  setToastMessage('Privacy settings updated successfully!');
  setShowToast(true);
};

const handleHelpAction = (message) => {
  setToastMessage(message);
  setShowToast(true);
};

  const filteredCommunitySkills = skills.filter((skill) => {
  const query = communitySearch.trim().toLowerCase();
  if (!query) return true;
  return (
    skill.name.toLowerCase().includes(query) ||
    skill.user_name.toLowerCase().includes(query)
  );
  });
  const aiMatches = mySkills.flatMap((mySkill) => {
  return skills
    .filter(
      (skill) =>
        skill.name.toLowerCase() !== mySkill.name.toLowerCase()
    )
    .slice(0, 3)
    .map((skill) => ({
      student: skill.user_name,
      skill: skill.name,
      reason: `Because you added ${mySkill.name}, this is a great skill to swap with.`,
    }));
  });
  const filteredStudents = users.filter((member) => {
    const query = studentSearch.trim().toLowerCase();
    if (!query) return true;
    return member.name.toLowerCase().includes(query)
      || member.skills?.some((skill) => skill.name.toLowerCase().includes(query));
  });
  const completedSwaps = requests.filter(
  (request) => request.status === "Accepted"
).length;

const profileCompletion =
  profile.name &&
  profile.email &&
  profile.skillsOffered &&
  profile.skillsWanted
    ? 100
    : 75;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setUsers([]);
    setSkills([]);
    setRequests([]);
    setForm(initialForm);
    setAuthMode('login');
    setError('');
    setSuccess('');
  };
  if (showSplash) {
  return (
    <div className="splash-screen d-flex justify-content-center align-items-center">
      <div className="text-center">
        <h1 className="fw-bold text-white">💜 SkillSwap AI</h1>
        <p className="text-white">Learn • Teach • Swap Skills</p>
      </div>
    </div>
  );
}
  if (!token || !user) {
    if (dashboardView === 'explore') {
      return (
        <ExploreSkillsScreen
          settings={settings}
          search={exploreSearch}
          setSearch={setExploreSearch}
          category={exploreCategory}
          setCategory={setExploreCategory}
          skills={exploreSkills}
          onSelectSkill={openExploreSkill}
          onBack={() => setAuthMode('landing')}
          onNavigate={setDashboardView}
          onLogout={handleLogout}
        />
      );
    }

    if (authMode === 'landing') {
      return (
        <LandingPage
          onLogin={() => changeAuthPage('login')}
          onRegister={() => changeAuthPage('register')}
          onHome={() => setDashboardView('dashboard')}
          onBrowse={() => setDashboardView('explore')}
          onSearch={(keyword) => {
            setExploreSearch(keyword.trim());
            setDashboardView('explore');
          }}
        />
      );
    }

    return (
      <main className="auth-page">
        <div className="auth-orb auth-orb-one" aria-hidden="true" />
        <div className="auth-orb auth-orb-two" aria-hidden="true" />
        <div className="container auth-container">
          <div className="row align-items-center justify-content-center g-5">
            <section className="col-lg-6 d-none d-lg-block text-white auth-intro">
              <div className="brand-mark mb-4"><span>↗</span></div>
              <p className="eyebrow text-white-50">COLLEGE COMMUNITY, REIMAGINED</p>
              <h1>Learn what you love.<br /><span>Teach what you know.</span></h1>
              <p className="intro-copy">SkillSwap AI connects curious students to share skills, build projects, and grow together.</p>
              <div className="d-flex gap-4 mt-4">
                <div><strong>500+</strong><small>student creators</small></div>
                <div><strong>120+</strong><small>skills exchanged</small></div>
              </div>
            </section>
            <section className="col-lg-5 col-md-8 col-sm-10">
              <div className="auth-card">
                <div className="text-center mb-4">
                  <div className="brand-mark brand-mark-mobile d-lg-none mx-auto mb-3"><span>↗</span></div>
                  <p className="eyebrow mb-2">WELCOME TO SKILLSWAP AI</p>
                  <h2>{isForgotPassword ? 'Reset your password' : authMode === 'login' ? 'Welcome back!' : 'Create your account'}</h2>
                  <p className="auth-subtitle">{isForgotPassword ? 'Enter your email and we’ll send you a reset link.' : authMode === 'login' ? 'Sign in and keep your learning in motion.' : 'Join a community that learns together.'}</p>
                </div>

                {!isForgotPassword ? <div className="auth-tabs mb-4" role="tablist" aria-label="Authentication options">
                  {['login', 'register'].map((mode) => (
                    <button key={mode} type="button" role="tab" aria-selected={authMode === mode}
                      className={authMode === mode ? 'active' : ''}
                      onClick={() => changeAuthPage(mode)}>
                      {mode === 'login' ? 'Log in' : 'Register'}
                    </button>
                  ))}
                </div> : <button type="button" className="back-to-login mb-4" onClick={() => changeAuthPage('login')}>← Back to login</button>}

                {error ? <div className="alert alert-danger py-2 small">{error}</div> : null}
                {success ? <div className="alert alert-success py-2 small">{success}</div> : null}

                {isForgotPassword ? (
                  <form onSubmit={handleResetSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="resetEmail">Email address</label>
                      <input id="resetEmail" type="email" className="form-control" placeholder="you@college.edu" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} required />
                    </div>
                    <button className="btn auth-submit w-100 mt-4" type="submit">Reset Password <span aria-hidden="true">→</span></button>
                  </form>
                ) : <form onSubmit={handleAuthSubmit}>
                  {authMode === 'register' ? (
                    <div className="mb-3">
                      <label className="form-label" htmlFor="fullName">Full name</label>
                      <input id="fullName" className="form-control" placeholder="Alex Johnson" name="name" value={form.name} onChange={handleFieldChange} required />
                    </div>
                  ) : null}

                  <div className="mb-3">
                    <label className="form-label" htmlFor="email">Email address</label>
                    <input id="email" type="email" className="form-control" placeholder="you@college.edu" name="email" value={form.email} onChange={handleFieldChange} required />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label" htmlFor="password">Password</label>
                      {authMode === 'login' ? <button type="button" className="forgot-link" onClick={() => changeAuthPage('forgot')}>Forgot password?</button> : null}
                    </div>
                    <input id="password" type="password" className="form-control" placeholder="Enter your password" name="password" value={form.password} onChange={handleFieldChange} required />
                  </div>

                  {authMode === 'register' ? (
                    <div className="mb-3">
                      <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                      <input id="confirmPassword" type="password" className="form-control" placeholder="Re-enter your password" name="confirmPassword" value={form.confirmPassword} onChange={handleFieldChange} required />
                    </div>
                  ) : null}

                  {authMode === 'register' ? (
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label" htmlFor="college">College <span>optional</span></label>
                        <input id="college" className="form-control" placeholder="Your university or college" name="college" value={form.college} onChange={handleFieldChange} />
                      </div>
                    </div>
                  ) : null}

                  <button className="btn auth-submit w-100 mt-4" type="submit" disabled={loading}>
                    {loading ? 'Please wait...' : authMode === 'login' ? 'Log in to SkillSwap' : 'Create My Account'} <span aria-hidden="true">→</span>
                  </button>
                  {authMode === "login" && (
  <>
    <div className="text-center my-3 text-muted">OR</div>

    <button
  type="button"
  className="btn google-btn w-100"
  onClick={() => {
    const googleUser = {
      id: "google-demo",
      name: "Isha Malaviya",
      email: "isha@gmail.com",
      college: "JG University",
      bio: "Signed in with Google (Demo)"
    };

    localStorage.setItem("token", "skillswap-google-token");
    localStorage.setItem("user", JSON.stringify(googleUser));

    setUser(googleUser);
    setToken("skillswap-google-token");
    setSuccess("Google Login Successful!");
  }}
>
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        width="20"
        className="me-2"
      />
      Continue with Google
    </button>
  </>
)}
                </form>}
                <p className="terms text-center mb-0 mt-4">{isForgotPassword ? 'Remembered your password? ' : authMode === 'register' ? <>Already a member? </> : 'New to SkillSwap? '}{isForgotPassword || authMode === 'register' ? <button type="button" className="inline-link" onClick={() => changeAuthPage('login')}>Log in</button> : <button type="button" className="inline-link" onClick={() => changeAuthPage('register')}>Register</button>}{authMode === 'register' && !isForgotPassword ? <><br /><span className="d-inline-block mt-2">By joining, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</span></> : null}</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    );
  }

  function LandingPage({ onLogin, onRegister, onHome, onBrowse, onSearch }) {
    const [keyword, setKeyword] = useState('');
    const popularSkills = ['Photoshop', 'Excel', 'Coding', 'Guitar', 'English', 'UI Design'];

    const submitSearch = (event) => {
      event.preventDefault();
      onSearch(keyword);
    };

    return (
      <main className="landing-page">
        <nav className="navbar navbar-expand-lg landing-nav">
          <div className="container">
            <button className="navbar-brand landing-brand" type="button" onClick={onHome}>
              <span className="landing-brand-mark" aria-hidden="true">↔</span>
              SkillSwap
            </button>
            <div className="landing-nav-links">
              <button type="button" className="landing-nav-link active" onClick={onHome}>Home</button>
              <button type="button" className="landing-nav-link" onClick={onBrowse}>Browse Skills</button>
            </div>
            <div className="landing-nav-actions">
              <button type="button" className="landing-nav-link" onClick={onLogin}>Login</button>
              <button type="button" className="btn landing-signup" onClick={onRegister}>Sign Up</button>
            </div>
          </div>
        </nav>

        <section className="landing-hero">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <p className="landing-eyebrow">LEARN. TEACH. CONNECT.</p>
                <h1>Exchange Skills.<br /><span>Grow Together.</span></h1>
                <p className="landing-subtitle">Share what you know. Learn what you want.</p>
                <form className="landing-search" onSubmit={submitSearch}>
                  <span aria-hidden="true">⌕</span>
                  <input
                    type="search"
                    aria-label="Search for a skill"
                    placeholder="Search for a skill (e.g. Photoshop, Excel...)"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                  />
                  <button type="submit" className="btn landing-search-button">Find a Skill</button>
                </form>
                <div className="landing-hero-actions">
                  <button type="button" className="btn landing-offer-button" onClick={onRegister}>Offer Your Skill <span aria-hidden="true">→</span></button>
                </div>
                <div className="landing-popular">
                  <span>Popular skills</span>
                  <div className="landing-skill-pills">
                    {popularSkills.map((skill) => <button type="button" key={skill} onClick={() => onSearch(skill)}>{skill}</button>)}
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="landing-illustration" aria-label="Students exchanging skills" role="img">
                  <div className="landing-illustration-sun" aria-hidden="true" />
                  <div className="landing-person landing-person-left"><span>✦</span></div>
                  <div className="landing-person landing-person-right"><span>↗</span></div>
                  <div className="landing-exchange" aria-hidden="true">↔</div>
                  <div className="landing-note landing-note-one">Design</div>
                  <div className="landing-note landing-note-two">Coding</div>
                  <div className="landing-ground" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-how-it-works">
          <div className="container">
            <div className="text-center landing-section-heading">
              <p className="landing-eyebrow">SIMPLE BY DESIGN</p>
              <h2>How SkillSwap works</h2>
            </div>
            <div className="row g-4">
              {[
                ['♙', 'Create Profile', 'List your skills and preferences'],
                ['⌕', 'Find a Skill', 'Search or browse other users'],
                ['↔', 'Swap', 'Connect and learn together'],
              ].map(([icon, title, description]) => (
                <div className="col-md-4" key={title}>
                  <article className="landing-step-card">
                    <span className="landing-step-icon" aria-hidden="true">{icon}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="landing-footer">
          <div className="container">
            <div className="landing-footer-main">
              <div>
                <button className="landing-brand landing-footer-brand" type="button" onClick={onHome}>
                  <span className="landing-brand-mark" aria-hidden="true">↔</span>
                  SkillSwap
                </button>
                <p>Exchange skills, connect with people, and grow together.</p>
              </div>
              <nav className="landing-footer-links" aria-label="Footer navigation">
                <a href="#about">About</a>
                <button type="button" onClick={onBrowse}>Browse Skills</button>
                <a href="mailto:support@skillswap.ai">Contact</a>
                <a href="#privacy">Privacy Policy</a>
              </nav>
              <div className="landing-social-links" aria-label="Social media links">
                <a href="#linkedin" aria-label="LinkedIn">in</a>
                <a href="#instagram" aria-label="Instagram">◎</a>
                <a href="#twitter" aria-label="Twitter">𝕏</a>
              </div>
            </div>
            <div className="landing-footer-bottom">© 2025 SkillSwap. Built for curious learners.</div>
          </div>
        </footer>
      </main>
    );
  }

  if (dashboardView === 'profile') {
    return (
      <ProfileScreen
        profile={profile}
        settings={settings}
        onBack={() => setDashboardView('dashboard')}
        onSettings={() => setDashboardView('settings')}
        onAccount={() => setDashboardView('account')}
        onNotifications={() => setDashboardView('notifications')}
        onPrivacy={() => setDashboardView('privacy')}
        onHelp={() => setDashboardView('help')}
        onAbout={() => setDashboardView('about')}
        onLogout={handleLogout}
        onToggleDarkMode={handleProfileDarkModeToggle}
        onClearNotifications={() => setNotifications([])}
        onExplore={() => setDashboardView('explore')}
        onPost={() => setDashboardView('post')}
        onMessages={() => setDashboardView('messages')}
        onNavigate={setDashboardView}
        onProfileChange={handleProfileChange}
        onProfileSave={handleProfileSave}
        stats={{ skills: mySkills.length || 5, swaps: requests.filter((request) => request.status === 'Accepted').length || 3, followers: 12, following: 8 }}
      />
    );
  }
  if (dashboardView === 'explore') {
    return (
      <ExploreSkillsScreen
        settings={settings}
        search={exploreSearch}
        setSearch={setExploreSearch}
        category={exploreCategory}
        setCategory={setExploreCategory}
        skills={[...exploreSkills, ...postedSkills]}
        onSelectSkill={openExploreSkill}
        onBack={() => setDashboardView('dashboard')}
        onNavigate={setDashboardView}
        onLogout={handleLogout}
      />
    );
  }

  if (dashboardView === 'account') {
    return <AccountScreen account={accountForm} onSave={handleAccountSave} onBack={() => setDashboardView('profile')} onHome={() => setDashboardView('dashboard')} onExplore={() => setDashboardView('explore')} onPost={() => setDashboardView('post')} onMessages={() => setDashboardView('messages')} onProfile={() => setDashboardView('profile')} onNavigate={setDashboardView} onLogout={handleLogout} settings={settings} showToast={showToast} toastMessage={toastMessage} />;
  }

  if (dashboardView === 'privacy') {
    return <PrivacyScreen privacySettings={privacySettings} onSave={handlePrivacySave} onClearNotifications={() => { setNotifications([]); setShowNotifications(false); handleHelpAction('Notifications cleared.'); }} onBack={() => setDashboardView('profile')} onHome={() => setDashboardView('dashboard')} onExplore={() => setDashboardView('explore')} onPost={() => setDashboardView('post')} onMessages={() => setDashboardView('messages')} onProfile={() => setDashboardView('profile')} onNavigate={setDashboardView} onLogout={handleLogout} settings={settings} showToast={showToast} toastMessage={toastMessage} />;
  }

  if (dashboardView === 'help') {
    return <HelpScreen onBack={() => setDashboardView('profile')} onHome={() => setDashboardView('dashboard')} onExplore={() => setDashboardView('explore')} onPost={() => setDashboardView('post')} onMessages={() => setDashboardView('messages')} onProfile={() => setDashboardView('profile')} onNavigate={setDashboardView} onLogout={handleLogout} onAction={handleHelpAction} settings={settings} showToast={showToast} toastMessage={toastMessage} />;
  }

  if (dashboardView === 'post') {
    return (
      <PostSkillScreen
        settings={settings}
        form={postForm}
        onChange={handlePostFieldChange}
        onModeChange={(mode) => setPostForm((previousForm) => ({ ...previousForm, mode }))}
        onImageChange={handlePostImageChange}
        onSubmit={handlePostSkill}
        onBack={() => setDashboardView('dashboard')}
        onExplore={() => setDashboardView('explore')}
        onMessages={() => setDashboardView('messages')}
        onProfile={() => setDashboardView('profile')}
        onNavigate={setDashboardView}
        onLogout={handleLogout}
      />
    );
  }

  if (dashboardView === 'messages') {
    return (
      <MessagesScreen
        settings={settings}
        chats={chats}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        search={chatSearch}
        setSearch={setChatSearch}
        draft={messageDraft}
        setDraft={setMessageDraft}
        onSend={handleSendMessage}
        onBack={() => setDashboardView('dashboard')}
        onExplore={() => setDashboardView('explore')}
        onPost={() => setDashboardView('post')}
        onProfile={() => setDashboardView('profile')}
        onNavigate={setDashboardView}
        onLogout={handleLogout}
      />
    );
  }

  if (dashboardView === 'notifications') {
    return (
      <NotificationsScreen
        settings={settings}
        onBack={() => setDashboardView('dashboard')}
        onExplore={() => setDashboardView('explore')}
        onPost={() => setDashboardView('post')}
        onProfile={() => setDashboardView('profile')}
        onNavigate={setDashboardView}
        onLogout={handleLogout}
      />
    );
  }

  if (dashboardView === 'skillDetails') {
    return (
      <SkillDetailsScreen
        settings={settings}
        skill={selectedSkill}
        onBack={() => setDashboardView('explore')}
        onRequestSwap={handleExploreRequest}
        onNavigate={setDashboardView}
        onLogout={handleLogout}
      />
    );
  }
  if (dashboardView === 'about') {
    
  return (
    <div className={`min-vh-100 about-legacy-page ${settings.darkMode ? "dark-theme" : "bg-light"}`}>
      <AppSidebar current="about" onNavigate={setDashboardView} onLogout={handleLogout} />
      <nav className="navbar dashboard-navbar shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold">SkillSwap AI</a>
          <button
            className="btn profile-nav-button"
            onClick={() => setDashboardView('dashboard')}
          >
            ← Dashboard
          </button>
        </div>
      </nav>

      <main className="container py-5">
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h2 className="text-center mb-3">💜 About SkillSwap AI</h2>
          <p className="text-center text-muted">
            SkillSwap AI is a student-to-student learning platform where students
            can exchange skills, connect with peers, and grow together.
          </p>

          <hr />

          <h4>📚 What can you do?</h4>
          <ul>
            <li>Add your skills.</li>
            <li>Request skill swaps with other students.</li>
            <li>Get AI-based skill recommendations.</li>
            <li>Track completed swaps and profile progress.</li>
          </ul>

          <hr />

          <h4>❓ Frequently Asked Questions</h4>

          <p><strong>1. What is SkillSwap AI?</strong></p>
          <p>A platform where college students teach and learn skills from each other.</p>

          <p><strong>2. Is SkillSwap AI free?</strong></p>
          <p>Yes. It is completely free for students.</p>

          <p><strong>3. How do I request a swap?</strong></p>
          <p>Click the Request Swap button in Community Skills.</p>

          <p><strong>4. How does AI Match work?</strong></p>
          <p>It recommends students based on the skills you add.</p>

          <hr />

          <h4>📧 Contact Us</h4>
          <p>Email: support@skillswap.ai</p>
          <p>College: JG University</p>

          <div className="text-center mt-4">
            <button
              className="btn add-skill-button"
              onClick={() => setDashboardView('dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
  if (dashboardView === 'settings') {
  return (
      <SettingsScreen
        settings={settings}
        showToast={showToast}
        toastMessage={toastMessage}
        onBack={() => setDashboardView('profile')}
        onSettingsChange={handleSettingsChange}
        onSettingsSave={handleSettingsSave}
        onLogout={handleLogout}
        onHome={() => setDashboardView('dashboard')}
        onExplore={() => setDashboardView('explore')}
        onPost={() => setDashboardView('post')}
        onMessages={() => setDashboardView('messages')}
        onProfile={() => setDashboardView('profile')}
        onNavigate={setDashboardView}
      />
  );
}

  if (dashboardView === 'dashboard') {
    return (
      <DashboardHome
        user={user}
        settings={settings}
        t={t}
        showToast={showToast}
        toastMessage={toastMessage}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notifications={notifications}
        mySkills={mySkills}
        setMySkills={setMySkills}
        skillForm={skillForm}
        setSkillForm={setSkillForm}
        handleSkillFieldChange={handleSkillFieldChange}
        handleSkillSubmit={handleSkillSubmit}
        handleClearMySkills={handleClearMySkills}
        skills={skills}
        filteredCommunitySkills={filteredCommunitySkills}
        communitySearch={communitySearch}
        setCommunitySearch={setCommunitySearch}
        selectedSkill={selectedSkill}
        setSelectedSkill={setSelectedSkill}
        setDashboardView={setDashboardView}
        handleClearSwapRequests={handleClearSwapRequests}
        requests={requests}
        handleRequestDecision={handleRequestDecision}
        filteredStudents={filteredStudents}
        studentSearch={studentSearch}
        setStudentSearch={setStudentSearch}
        completedSwaps={completedSwaps}
        profileCompletion={profileCompletion}
        loading={loading}
        handleLogout={handleLogout}
      />
    );
  }

  return (
    <div className={`min-vh-100 ${settings.darkMode ? "dark-theme" : "bg-light"}`}>
      {showToast && (
      <div className="toast-popup">
        {toastMessage}
      </div>
      )}
      <nav className="navbar dashboard-navbar shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">SkillSwap AI</a>
          <div className="d-flex align-items-center gap-2 dashboard-header-actions">
            <div className="dashboard-user-summary">
  <strong>{user.name}</strong>
  <small>{user.email}</small>
</div>

<button
  className="btn profile-nav-button"
  onClick={() => setDashboardView("about")}
>
  {t.about}
</button>

<button
  className="btn profile-nav-button"
  onClick={() => setDashboardView("settings")}
>
  {t.settings}
</button>
<button className="btn dashboard-logout" onClick={handleLogout}>
  {t.logout} <span aria-hidden="true">→</span>
</button>

{settings.notifications && (
  <div className="position-relative">
    <button
      className="btn profile-icon"
      onClick={() => setShowNotifications(!showNotifications)}
    >
      🔔
    </button>

    {showNotifications && (
      <div className="notification-box">
        <h6>Notifications</h6>

        {notifications.length === 0 ? (
          <p className="small m-0">No notifications</p>
        ) : (
          notifications.map((item) => (
            <div key={item.id} className="notification-item">
              {item.text}
            </div>
          ))
        )}
      </div>
    )}
  </div>
)}

<button
  className="btn profile-icon"
  onClick={() => setDashboardView("profile")}
>
  {user.name?.charAt(0).toUpperCase()}
</button>

          </div>
        </div>
      </nav>

      
        <div className="container py-4">
          <div className="row g-3 mb-4">

  <div className="col-md-4">
    <div className="progress-card">
      <h6>📚 Skills Added</h6>
      <h2>{mySkills.length}</h2>
      <p>Total skills you have shared.</p>
    </div>
  </div>

  <div className="col-md-4">
    <div className="progress-card">
      <h6>🔄 Swaps Completed</h6>
      <h2>{completedSwaps}</h2>
      <p>Accepted swap requests.</p>
    </div>
  </div>

  <div className="col-md-4">
    <div className="progress-card">
      <h6>⭐ Profile Completion</h6>
      <h2>{profileCompletion}%</h2>
      <p>Your SkillSwap profile status.</p>
    </div>
  </div>

</div>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="mb-0">{user.name}</h5>
                      <small className="text-muted">{user.college || 'Student'}</small>
                    </div>
                  </div>

                  <p className="text-muted">{user.bio || 'No bio yet. Add one in your profile.'}</p>

                  <div className="small text-secondary">
                    <div>Email: {user.email}</div>
                  </div>
                </div>
              </div>

              <div className="card shadow-sm border-0 rounded-4 mt-4">
                <div className="card-body">
                  <h5 className="mb-3">Add a skill</h5>
                  <form onSubmit={handleSkillSubmit}>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        placeholder="Skill name"
                        name="name"
                        value={skillForm.name}
                        onChange={handleSkillFieldChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <select
                        className="form-select"
                        name="level"
                        value={skillForm.level}
                        onChange={handleSkillFieldChange}
                        required
                      >
                        <option value="" disabled>Skill level</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <input
                        className="form-control"
                        placeholder="Category"
                        name="category"
                        value={skillForm.category}
                        onChange={handleSkillFieldChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        placeholder="Short description"
                        name="description"
                        rows="3"
                        value={skillForm.description}
                        onChange={handleSkillFieldChange}
                      />
                    </div>

                    <button className="btn add-skill-button w-100" type="submit">
                      {t.addSkill} <span aria-hidden="true">+</span>
                    </button>
                  </form>
                  <div className="card shadow-sm border-0 rounded-4 mt-4">
  <div className="card-body">
    <h5 className="mb-3">💡 Quick Tips</h5>

    <div className="d-flex flex-column gap-3">

      <div className="d-flex align-items-start gap-2">
        <span>✅</span>
        <small>Add at least 3 skills to improve AI recommendations.</small>
      </div>

      <div className="d-flex align-items-start gap-2">
        <span>🎯</span>
        <small>Select the correct skill level (Beginner, Intermediate, Advanced).</small>
      </div>

      <div className="d-flex align-items-start gap-2">
        <span>📝</span>
        <small>Write a short description so other students understand your skill.</small>
      </div>

      <div className="d-flex align-items-start gap-2">
        <span>🤝</span>
        <small>Accept skill swap requests to increase your profile completion.</small>
      </div>

    </div>
  </div>
</div>
<div className="card shadow-sm border-0 rounded-4 mt-4">
  <div className="card-body">
    <h5 className="mb-3">📊 Your Learning Stats</h5>

    <div className="mb-3">
      <small>Skills Added</small>
      <div className="progress mt-1">
        <div
          className="progress-bar bg-primary"
          style={{ width: `${mySkills.length * 20}%` }}
        >
          {mySkills.length}
        </div>
      </div>
    </div>

    <div className="mb-3">
      <small>Swap Requests</small>
      <div className="progress mt-1">
        <div
          className="progress-bar bg-success"
          style={{ width: `${requests.length * 15}%` }}
        >
          {requests.length}
        </div>
      </div>
    </div>

    <div>
      <small>Profile Completion</small>
      <div className="progress mt-1">
        <div
          className="progress-bar bg-warning text-dark"
          style={{ width: `${profileCompletion}%` }}
        >
          {profileCompletion}%
        </div>
      </div>
    </div>
  </div>
</div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              {error ? <div className="alert alert-danger">{error}</div> : null}
              {success ? <div className="alert alert-success">{success}</div> : null}

              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <div>
                      
                    
<div className="card shadow-sm border-0 rounded-4 mb-4">
  <div className="card-body">
    <h4 className="mb-3">🤖 AI Skill Match</h4>

    {mySkills.length === 0 ? (
      <p className="text-muted">
        Add a skill to see AI recommendations.
      </p>
    ) : (
      mySkills.map((skill, index) => (
        <div key={index} className="community-skill-card mb-3">
          <h6>{skill.name}</h6>
          <p><strong>Recommended Skill:</strong> UI/UX</p>
          <small>AI suggests students who can help you improve this skill.</small>
        </div>
      ))
    )}
  </div>
</div>
    
                    <h4 className="mb-1">{t.mySkills}</h4>

<p className="text-muted small mb-0">
  {t.skillsReady}
</p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="my-skills-count">{mySkills.length}</span>
                      <button className="btn clear-requests-button" onClick={handleClearMySkills} disabled={mySkills.length === 0}>
                        {t.clearSkills}
                      </button>
                    </div>
                  </div>
                  {mySkills.length > 0 ? (
                    <div className="row g-3">
                      {mySkills.map((skill) => (
                        <div key={skill.id} className="col-md-6">
                          <article className="my-skill-card h-100">
                            <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                              <div>
                                <p className="skill-category mb-1">{skill.category}</p>
                                <h5 className="mb-0">{skill.name}</h5>
                              </div>
                              <span className="skill-level">{skill.level}</span>
                            </div>
                            <p className="mb-0">{skill.description || 'Ready to share this skill with the community.'}</p>
                          </article>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="my-skills-empty">Your added skills will appear here.</div>
                  )}
                </div>
              </div>

              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-body">
                  <h4 className="mb-3">{t.communitySkills}</h4>
                  <input
  type="search"
  className="form-control mb-3"
  placeholder="Search skills or student..."
  value={communitySearch}
  onChange={(e) => setCommunitySearch(e.target.value)}
/>
                  <div className="row g-3">
                    {skills.length > 0 ? (
                      filteredCommunitySkills.map((skill) => (
                        <div key={skill.id} className="col-md-6">
                          <div className="community-skill-card h-100">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0">{skill.name}</h6>
                              <span className="skill-level">{skill.category}</span>
                            </div>
                            <p className="small text-muted mb-2">Offered by {skill.user_name}</p>
                            <p className="small mb-0">{skill.description || 'No extra description provided.'}</p>

                            {skill.user_id !== user.id ? (
                              <button
                                className="btn btn-outline-primary btn-sm mt-3"
                                onClick={() => {
  setSelectedSkill(skill);
  setDashboardView("skillDetails");
}}
                                disabled={loading}
                              >
                                Request Swap
                              </button>
                            ) : (
                              <span className="small text-success mt-3 d-inline-block">Your skill</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-muted">No skills posted yet.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <h4 className="mb-0">{t.swapRequests}</h4>
                    <button className="btn clear-requests-button" onClick={handleClearSwapRequests} disabled={requests.length === 0}>
                      {t.clearRequests}
                    </button>
                  </div>
                  {requests.length > 0 ? (
                    <div className="row g-3">
                      {requests.map((request) => (
                        <div key={request.id} className="col-md-6">
                          <article className="swap-request-card h-100">
                            <div className="d-flex justify-content-between align-items-start gap-2">
                              <div>
                                <p className="skill-category mb-1">{request.requester_name === 'You' ? `TO ${request.target_name}` : `FROM ${request.requester_name}`}</p>
                                <h6 className="mb-0">{request.requester_name === 'You' ? `Requesting ${request.skill_offered}` : <>{request.skill_offered} <span>↔</span> {request.skill_wanted}</>}</h6>
                              </div>
                              <span className={`request-status ${request.status.toLowerCase()}`}>{request.status}</span>
                            </div>
                            <p className="small mb-3 mt-3">{request.message}</p>
                            {request.status === 'Pending' ? (
                              <div className="d-flex gap-2">
                                <button className="btn btn-sm request-accept flex-grow-1" onClick={() => handleRequestDecision(request.id, 'Accepted')}>Accept</button>
                                <button className="btn btn-sm request-decline flex-grow-1" onClick={() => handleRequestDecision(request.id, 'Declined')}>Decline</button>
                              </div>
                            ) : null}
                          </article>
                          </div>
                      ))}
                    </div>
                  ) : (
                    <div className="my-skills-empty">No swap requests yet.</div>
                  )}
                </div>
              </div>

              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                    <h4 className="mb-0">{t.students}</h4>
                    <div className="student-search">
                      <span aria-hidden="true">⌕</span>
                      <input
                        type="search"
                        aria-label="Search students by name or skill"
                        placeholder="Search students or skills"
                        value={studentSearch}
                        onChange={(event) => setStudentSearch(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row g-3">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((member) => (
                        <div className="col-md-6" key={member.id}>
                        <article className="student-card h-100">
                          {member.profilePublic === false ? <div className="private-profile-state">🔒<strong>Private Profile</strong><small>This student's profile details are hidden.</small></div> : <>
                            <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                              <div>
                                <p className="skill-category mb-1">{member.department}</p>
                                <h6 className="mb-1">{member.name}</h6>
                                <div className="student-college">{member.college || 'College not added'}</div>
                              </div>
                              <span className="my-skills-count">{member.skills?.length || 0}</span>
                            </div>
                            <p className="student-detail-label mb-2">Offered skills</p>
                            {member.skills && member.skills.length > 0 ? <div className="d-flex flex-column gap-2">{member.skills.map((skill) => <div key={skill.id} className="student-skill-row"><span>{skill.name}</span><span>{skill.level}</span></div>)}</div> : <div className="small">No skills listed yet.</div>}
                            <div className="student-availability mt-3"><span aria-hidden="true">◷</span> {member.availability}</div>
                          </>}
                        </article>
                        </div>
                      ))
                    ) : (
                      <div className="col-12"><div className="my-skills-empty">No students found</div></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
}

function DashboardHome({
  user,
  settings,
  t,
  showToast,
  toastMessage,
  showNotifications,
  setShowNotifications,
  notifications,
  mySkills,
  setMySkills,
  skillForm,
  setSkillForm,
  handleSkillFieldChange,
  handleSkillSubmit,
  handleClearMySkills,
  skills,
  filteredCommunitySkills,
  communitySearch,
  setCommunitySearch,
  setSelectedSkill,
  setDashboardView,
  handleClearSwapRequests,
  requests,
  handleRequestDecision,
  filteredStudents,
  studentSearch,
  setStudentSearch,
  completedSwaps,
  profileCompletion,
  loading,
  handleLogout,
}) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const addRecommendedSkill = (name, category, description) => {
    const newSkill = { id: `my-skill-${Date.now()}`, name, category, level: 'Intermediate', description };
    const updatedSkills = [newSkill, ...mySkills];
    setMySkills(updatedSkills);
    setSkillForm({ name: '', category: '', level: '', description: '' });
    localStorage.setItem('skillswap-my-skills', JSON.stringify(updatedSkills));
    scrollTo('my-skills');
  };

  return (
    <div className={`skillswap-dashboard ${settings.darkMode ? 'dark-theme' : ''}`}>
      {showToast ? <div className="toast-popup">{toastMessage}</div> : null}
      <AppSidebar current="dashboard" onNavigate={setDashboardView} onLogout={handleLogout} />
      <div className="dashboard-stage">
        <header className="dashboard-hero">
        <div className="dashboard-hero-glow" aria-hidden="true" />
        <div className="container dashboard-hero-inner">
          <div>
            <p className="dashboard-kicker">SKILLSWAP AI</p>
            <h1>Hello, {user.name || 'Isha'} 👋</h1>
            <p>Find your next skill or share yours!</p>
          </div>
          <button className="dashboard-avatar" aria-label="Open profile" onClick={() => setDashboardView('profile')}>
            {user.name?.charAt(0).toUpperCase() || 'I'}
          </button>
        </div>
        <div className="container dashboard-search-wrap">
          <div className="dashboard-search">
            <span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Search skills, people, or courses..." value={communitySearch} onChange={(event) => setCommunitySearch(event.target.value)} onFocus={() => scrollTo('community-skills')} />
          </div>
        </div>
        </header>

      <div className="dashboard-layout">
      <main className="container dashboard-content">
        <section className="skill-match-banner" onClick={() => scrollTo('community-skills')} role="button" tabIndex="0">
          <div>
            <span className="dashboard-kicker">AI POWERED</span>
            <h2>Skill Match</h2>
            <p>Find perfect skill partners with AI</p>
            <button className="skill-match-button" onClick={(event) => { event.stopPropagation(); scrollTo('community-skills'); }}>Try Now <span>→</span></button>
          </div>
          <div className="skill-match-sparkle" aria-hidden="true">✦</div>
        </section>

        <section className="quick-actions-section">
          <div className="dashboard-section-heading"><h2>Quick Actions</h2></div>
          <div className="quick-actions-grid">
            <button className="quick-action" onClick={() => setDashboardView('explore')}><span>⌕</span><strong>Browse</strong></button>
            <button className="quick-action" onClick={() => scrollTo('my-skills')}><span>▦</span><strong>My Skills</strong></button>
            <button className="quick-action" onClick={() => setDashboardView('notifications')}><span>♢</span><strong>Notifications</strong></button>
            <button className="quick-action" onClick={() => setDashboardView('profile')}><span>●</span><strong>Profile</strong></button>
          </div>
          {showNotifications && settings.notifications ? <div className="dashboard-notifications">
            <strong>Notifications</strong>
            {notifications.length ? notifications.map((item) => <div key={item.id}>{item.text}</div>) : <span>No notifications</span>}
          </div> : null}
        </section>

        <section className="recommended-section">
          <div className="dashboard-section-heading"><h2>Recommended for You</h2><button onClick={() => scrollTo('community-skills')}>View All</button></div>
          <div className="recommended-grid">
            {[
              ['Web Development', 'Learn React, HTML, CSS', '</>'],
              ['Graphic Design', 'Improve your design skills', '✎'],
              ['Communication', 'Build your soft skills', '✦'],
            ].map(([name, subtitle, icon]) => <article className="recommended-card" key={name}>
              <div className="recommended-icon">{icon}</div>
              <div><h3>{name}</h3><p>{subtitle}</p></div>
              <button aria-label={`Add ${name}`} onClick={() => addRecommendedSkill(name, 'Recommended', subtitle)}>+</button>
            </article>)}
          </div>
        </section>

        <section className="dashboard-stats">
          <article><span>Skills Added</span><strong>{mySkills.length}</strong></article>
          <article><span>Swap Requests</span><strong>{requests.length}</strong></article>
          <article><span>Profile Completion</span><strong>{profileCompletion}%</strong></article>
        </section>

        <section id="my-skills" className="dashboard-panel">
          <div className="dashboard-section-heading"><div><h2>{t.mySkills}</h2><p>Your skills are ready to share.</p></div><button className="outline-action" onClick={handleClearMySkills} disabled={!mySkills.length}>Clear Skills</button></div>
          <form className="add-skill-form" onSubmit={handleSkillSubmit}>
            <input placeholder="Skill name" name="name" value={skillForm.name} onChange={handleSkillFieldChange} required />
            <select name="level" value={skillForm.level} onChange={handleSkillFieldChange} required><option value="" disabled>Level</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
            <input placeholder="Category" name="category" value={skillForm.category} onChange={handleSkillFieldChange} required />
            <input placeholder="Short description" name="description" value={skillForm.description} onChange={handleSkillFieldChange} />
            <button className="primary-action" type="submit">{t.addSkill} +</button>
          </form>
          <div className="skill-chip-grid">{mySkills.length ? mySkills.map((skill) => <article className="skill-chip" key={skill.id}><span>{skill.category}</span><h3>{skill.name}</h3><p>{skill.description || 'Ready to share this skill.'}</p><b>{skill.level}</b></article>) : <div className="empty-dashboard-state">Your added skills will appear here.</div>}</div>
        </section>

        <section id="community-skills" className="dashboard-panel">
          <div className="dashboard-section-heading"><div><h2>{t.communitySkills}</h2><p>Find students who can teach what you want to learn.</p></div></div>
          <div className="dashboard-inline-search"><span>⌕</span><input type="search" placeholder="Search skills or student..." value={communitySearch} onChange={(event) => setCommunitySearch(event.target.value)} /></div>
          <div className="community-grid">{skills.length ? filteredCommunitySkills.map((skill) => <article className="community-card" key={skill.id}><div><span>{skill.category}</span><h3>{skill.name}</h3><p>Offered by {skill.user_name}</p></div><p>{skill.description || 'No extra description provided.'}</p>{skill.user_id !== user.id ? <button className="outline-action" disabled={loading} onClick={() => { setSelectedSkill(skill); setDashboardView('skillDetails'); }}>Request Swap</button> : <small>Your skill</small>}</article>) : <div className="empty-dashboard-state">No skills posted yet.</div>}</div>
        </section>

        <section id="swap-requests" className="dashboard-panel">
          <div className="dashboard-section-heading"><h2>{t.swapRequests}</h2><button className="outline-action" onClick={handleClearSwapRequests} disabled={!requests.length}>Clear Requests</button></div>
          {requests.length ? <div className="request-grid">{requests.map((request) => <article className="request-card" key={request.id}><div><span>{request.requester_name === 'You' ? `TO ${request.target_name}` : `FROM ${request.requester_name}`}</span><h3>{request.requester_name === 'You' ? `Requesting ${request.skill_offered}` : `${request.skill_offered} ↔ ${request.skill_wanted}`}</h3></div><b>{request.status}</b><p>{request.message}</p>{request.status === 'Pending' ? <div><button onClick={() => handleRequestDecision(request.id, 'Accepted')}>Accept</button><button onClick={() => handleRequestDecision(request.id, 'Declined')}>Decline</button></div> : null}</article>)}</div> : <div className="empty-dashboard-state">No swap requests yet.</div>}
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-section-heading"><div><h2>{t.students}</h2><p>Meet students in the SkillSwap community.</p></div><div className="dashboard-inline-search compact"><span>⌕</span><input placeholder="Search students or skills" value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} /></div></div>
          <div className="student-grid">{filteredStudents.map((member) => <article className="student-dashboard-card" key={member.id}>{member.profilePublic === false ? <div className="private-profile-state">🔒<strong>Private Profile</strong><small>This student's profile details are hidden.</small></div> : <><span>{member.department}</span><h3>{member.name}</h3><p>{member.college || 'College not added'}</p><div>{member.skills?.map((skill) => <small key={skill.id}>{skill.name} · {skill.level}</small>)}</div><footer>◷ {member.availability}</footer></>}</article>)}</div>
        </section>
      </main>
      <aside className="dashboard-progress-panel">
        <div className="progress-panel-heading"><span className="dashboard-kicker">YOUR PROGRESS</span><span>↗</span></div>
        <div className="progress-ring"><strong>{profileCompletion}%</strong><span>complete</span></div>
        <div className="progress-panel-stats"><div><strong>{mySkills.length + completedSwaps}</strong><span>Skills Learned</span></div><div><strong>{mySkills.length}</strong><span>Skills Taught</span></div><div><strong>{requests.length}</strong><span>Total Swaps</span></div></div>
        <div className="progress-panel-actions"><h3>Quick Actions</h3><button onClick={() => setDashboardView('post')}><span>＋</span>Post a Skill <b>→</b></button><button onClick={() => setDashboardView('explore')}><span>◎</span>Find a Partner <b>→</b></button><button onClick={() => setDashboardView('messages')}><span>◌</span>View Messages <b>→</b></button></div>
      </aside>
      </div>

      </div>
    </div>
  );
}

function AppSidebar({ current, onNavigate, onLogout }) {
  const [open, setOpen] = useState(false);
  const items = [
    ['dashboard', '⌂', 'Home'],
    ['explore', '◎', 'Explore'],
    ['post', '＋', 'Post'],
    ['messages', '◌', 'Messages'],
    ['notifications', '♢', 'Notifications'],
    ['profile', '●', 'Profile'],
    ['settings', '⚙', 'Settings'],
  ];

  return (
    <>
      <button className="sidebar-menu-trigger" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)}>☰</button>
      {open ? <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} /> : null}
      <aside className={`app-sidebar ${open ? 'open' : ''}`}>
        <div className="dashboard-sidebar-brand"><span>✦</span><strong>SkillSwap <em>AI</em></strong><button className="sidebar-close" aria-label="Close navigation" onClick={() => setOpen(false)}>×</button></div>
        <nav className="dashboard-sidebar-nav" aria-label="Application navigation">
          {items.map(([view, icon, label]) => <button key={view} className={current === view ? 'active' : ''} onClick={() => { onNavigate(view); setOpen(false); }}><span>{icon}</span>{label}</button>)}
        </nav>
        <button className="dashboard-sidebar-logout" onClick={onLogout}>↪ Log out</button>
      </aside>
    </>
  );
}

function ProfileScreen({ profile, settings, onBack, onSettings, onAccount, onNotifications, onPrivacy, onHelp, onAbout, onLogout, onToggleDarkMode, onExplore, onPost, onMessages, onProfileChange, onProfileSave, stats, onNavigate }) {
  const [activeTab, setActiveTab] = useState('My Skills');
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [profileToast, setProfileToast] = useState('');
  const menuRef = useRef(null);
  const skills = [
    { name: 'React Development', mode: 'Teaching', learners: '3 learners', icon: '</>', tone: 'violet' },
    { name: 'UI/UX Design', mode: 'Learning', learners: '2 learners', icon: '✦', tone: 'blue' },
    { name: 'Java Programming', mode: 'Teaching', learners: '1 learner', icon: 'J', tone: 'green' },
    { name: 'Graphic Design', mode: 'Learning', learners: '1 learner', icon: '✎', tone: 'peach' },
  ];
  const learning = [
    { name: 'Python Programming', progress: 70 },
    { name: 'Figma UI Design', progress: 45 },
    { name: 'Communication Skills', progress: 90 },
    { name: 'Android Development', progress: 30 },
  ];
  const reviews = [
    { name: 'Aarav Patel', initials: 'AP', rating: '★★★★★', comment: 'Great React mentor.' },
    { name: 'Neha Soni', initials: 'NS', rating: '★★★★', comment: 'Helpful UI/UX guidance.' },
    { name: 'Maya Patel', initials: 'MP', rating: '★★★★★', comment: 'Easy to learn with Isha.' },
    { name: 'Krisha Mehta', initials: 'KM', rating: '★★★★★', comment: 'Very supportive during skill swap.' },
  ];

  useEffect(() => {
    const closeMenu = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  useEffect(() => {
    if (!profileToast) return undefined;
    const timer = window.setTimeout(() => setProfileToast(''), 3000);
    return () => window.clearTimeout(timer);
  }, [profileToast]);

  const saveProfile = (event) => {
    onProfileSave(event);
    setEditOpen(false);
    setProfileToast('Profile updated successfully!');
  };

  const chooseMenuItem = (action) => {
    setMenuOpen(false);
    action();
  };

  return (
    <div className={`profile-screen ${settings.darkMode ? 'dark-theme' : ''}`}>
      <header className="profile-screen-header">
        <button className="profile-screen-icon" aria-label="Back to dashboard" onClick={onBack}>←</button>
        <strong>SkillSwap AI</strong>
        <div className="profile-menu-wrap" ref={menuRef}>
          <button className="profile-screen-icon" aria-label="Open profile menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>⋮</button>
          {menuOpen ? <div className="profile-menu" role="menu">
            <button type="button" onClick={() => chooseMenuItem(onSettings)}>⚙️ Settings</button>
            <button type="button" onClick={() => chooseMenuItem(onAccount)}>👤 Account</button>
            <button type="button" onClick={() => chooseMenuItem(onNotifications)}>🔔 Notifications</button>
            <button type="button" onClick={() => chooseMenuItem(onPrivacy)}>🔒 Privacy &amp; Security</button>
            <button type="button" onClick={() => chooseMenuItem(onHelp)}>❓ Help &amp; Support</button>
            <button type="button" onClick={() => chooseMenuItem(onAbout)}>ℹ️ About</button>
            <button type="button" onClick={() => chooseMenuItem(onToggleDarkMode)}>🌙 Dark Mode</button>
            <button type="button" onClick={() => chooseMenuItem(onLogout)}>🚪 Logout</button>
          </div> : null}
        </div>
      </header>
      <main className="profile-screen-content">
        <section className="profile-summary">
          <div className="profile-screen-avatar">IM</div>
          <h1>{profile.name || 'Isha Malaviya'}</h1>
          <p>{profile.department || 'iMSC(IT)'} <span>•</span> 3rd Year</p>
          <div className="profile-stats">
            <div><strong>{stats.skills}</strong><span>Skills</span></div>
            <div><strong>{stats.swaps}</strong><span>Swaps</span></div>
            <div><strong>{stats.followers}</strong><span>Followers</span></div>
            <div><strong>{stats.following}</strong><span>Following</span></div>
          </div>
          <button className="profile-edit-button" onClick={() => setEditOpen(true)}>Edit Profile <span>→</span></button>
        </section>
        <div className="profile-tabs" role="tablist" aria-label="Profile sections">
          {['My Skills', 'Learning', 'Reviews'].map((tab) => <button key={tab} role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </div>
        {activeTab === 'My Skills' ? <section className="profile-skill-list" aria-label="My skills">
          {skills.map((skill) => <article className="profile-skill-item" key={skill.name}>
            <div className={`profile-skill-icon ${skill.tone}`}>{skill.icon}</div>
            <div><h2>{skill.name}</h2><p><span className={skill.mode === 'Teaching' ? 'teaching' : 'learning'}>{skill.mode}</span> <b>•</b> {skill.learners}</p></div>
            <span className="profile-skill-arrow">›</span>
          </article>)}
        </section> : null}
        {activeTab === 'Learning' ? <section className="profile-learning-list" aria-label="Learning progress">
          {learning.map((item) => <article className="profile-learning-card" key={item.name}><div className="profile-learning-heading"><strong>{item.name}</strong><span>{item.progress}%</span></div><div className="profile-progress-track"><span style={{ width: `${item.progress}%` }} /></div><button type="button">Continue Learning <span>→</span></button></article>)}
        </section> : null}
        {activeTab === 'Reviews' ? <section className="profile-reviews-list" aria-label="Reviews">
          <article className="profile-average-rating"><strong>4.8</strong><span>/ 5</span><div>★★★★★</div><small>Average rating</small></article>
          {reviews.map((review) => <article className="profile-review-card" key={review.name}><div className="profile-review-avatar">{review.initials}</div><div><strong>{review.name}</strong><span className="profile-review-stars">{review.rating}</span><p>{review.comment}</p></div></article>)}
        </section> : null}
      </main>

      {editOpen ? <div className="profile-modal-backdrop" role="presentation"><section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title"><div className="profile-modal-heading"><h2 id="edit-profile-title">Edit Profile</h2><button type="button" aria-label="Close edit profile" onClick={() => setEditOpen(false)}>×</button></div><form onSubmit={saveProfile}>
        <div className="profile-form-grid">
          <label>Name<input name="name" value={profile.name || ''} onChange={onProfileChange} required /></label>
          <label>Email<input type="email" name="email" value={profile.email || ''} onChange={onProfileChange} required /></label>
          <label>Department<input name="department" value={profile.department || ''} onChange={onProfileChange} required /></label>
          <label>Availability<input name="availability" value={profile.availability || ''} onChange={onProfileChange} required /></label>
          <label>Skills Offered<textarea name="skillsOffered" rows="2" value={profile.skillsOffered || ''} onChange={onProfileChange} required /></label>
          <label>Skills Wanted<textarea name="skillsWanted" rows="2" value={profile.skillsWanted || ''} onChange={onProfileChange} required /></label>
          <label className="profile-form-wide">Bio / About Me<textarea name="bio" rows="3" value={profile.bio || ''} onChange={onProfileChange} placeholder="Tell the community about you..." /></label>
          <fieldset className="profile-visibility-fieldset profile-form-wide">
            <legend>Profile Visibility</legend>
            <label className="profile-visibility-option">
              <input type="radio" name="profilePublic" value="true" checked={profile.profilePublic !== false} onChange={onProfileChange} />
              <span><strong>🌐 Public</strong><small>Your profile is visible to other students.</small></span>
            </label>
            <label className="profile-visibility-option">
              <input type="radio" name="profilePublic" value="false" checked={profile.profilePublic === false} onChange={onProfileChange} />
              <span><strong>🔒 Private</strong><small>Your full profile is hidden from other students.</small></span>
            </label>
          </fieldset>
        </div>
        <div className="profile-modal-actions"><button type="button" className="profile-cancel-button" onClick={() => setEditOpen(false)}>Cancel</button><button type="submit" className="profile-save-button">Save Changes</button></div>
      </form></section></div> : null}

      {profileToast ? <div className="profile-success-toast" role="status">{profileToast}</div> : null}
      <AppSidebar current="profile" onNavigate={onNavigate} onLogout={onLogout} />
    </div>
  );
}

function SettingsScreen({ settings, showToast, toastMessage, onBack, onSettingsChange, onSettingsSave, onLogout, onHome, onExplore, onPost, onMessages, onProfile, onNavigate }) {
  const [notificationsOn, setNotificationsOn] = useState(settings.notifications);
  const rows = [
    { label: 'Account', icon: '◯', type: 'link' },
    { label: 'Notifications', icon: '♧', type: 'toggle', name: 'notifications', checked: notificationsOn, setChecked: setNotificationsOn },
    { label: 'Language', icon: '◎', type: 'language' },
    { label: 'Dark Mode', icon: '◐', type: 'toggle', name: 'darkMode', checked: settings.darkMode },
    { label: 'Privacy & Security', icon: '▣', type: 'link' },
    { label: 'Help & Support', icon: '?', type: 'link' },
    { label: 'About', icon: 'ⓘ', type: 'link' },
  ];

  const handleToggle = (event, row) => {
    if (row.setChecked) row.setChecked(event.target.checked);
    onSettingsChange(event);
  };

  return (
    <div className={`settings-screen ${settings.darkMode ? 'dark-theme' : ''}`}>
      {showToast ? <div className="toast-popup">{toastMessage}</div> : null}
      <header className="settings-screen-header">
        <button className="settings-back-button" aria-label="Back to profile" onClick={onBack}>←</button>
        <h1>Settings</h1>
        <span className="settings-header-spacer" aria-hidden="true" />
      </header>
      <main className="settings-screen-content">
        <section className="settings-list" aria-label="Settings">
          {rows.map((row) => <div className="settings-row" key={row.label}>
            <span className="settings-row-icon" aria-hidden="true">{row.icon}</span>
            <span className="settings-row-label">{row.label}</span>
            {row.type === 'toggle' ? <label className="settings-toggle" aria-label={`${row.label} toggle`}>
              <input type="checkbox" name={row.name} checked={row.checked} onChange={(event) => handleToggle(event, row)} />
              <span />
            </label> : row.type === 'language' ? <select className="settings-language-select" name="language" value={settings.language} onChange={onSettingsChange} aria-label="Language">
              <option>English</option><option>Hindi</option><option>Gujarati</option>
            </select> : <span className={`settings-row-action ${row.detail ? 'detail' : 'chevron'}`}>{row.detail || '›'}</span>}
          </div>)}
        </section>
        <button className="settings-save-button" onClick={onSettingsSave}>Save Settings</button>
        <button className="settings-logout" onClick={onLogout}>Log Out</button>
      </main>
      <AppSidebar current="settings" onNavigate={onNavigate} onLogout={onLogout} />
    </div>
  );
}

function AccountScreen({ account, onSave, onBack, onHome, onExplore, onPost, onMessages, onProfile, onNavigate, onLogout, settings, showToast, toastMessage }) {
  const [editing, setEditing] = useState(false);
  const [draftAccount, setDraftAccount] = useState(account);
  useEffect(() => setDraftAccount(account), [account]);
  const handleDraftChange = (event) => {
    const { name, value } = event.target;
    setDraftAccount((previousAccount) => ({ ...previousAccount, [name]: value }));
  };

  return (
    <div className={`account-screen ${settings.darkMode ? 'dark-theme' : ''}`}>
      {showToast ? <div className="toast-popup">{toastMessage}</div> : null}
      <header className="account-screen-header"><button className="screen-icon-button" aria-label="Back to Profile" onClick={onBack}>←</button><h1>Account</h1><span className="settings-header-spacer" /></header>
      <main className="account-screen-content">
        <section className="account-hero"><div className="account-avatar">{draftAccount.name?.charAt(0).toUpperCase() || 'I'}</div><div><span className="dashboard-kicker">ACCOUNT INFORMATION</span><h2>{draftAccount.name}</h2><p>{draftAccount.email}</p></div></section>
        <form className="account-card" onSubmit={(event) => { onSave(event, draftAccount); setEditing(false); }}>
          <div className="account-card-heading"><div><span className="dashboard-kicker">YOUR DETAILS</span><h2>Personal information</h2></div><button type="button" className="outline-action" onClick={() => setEditing(true)}>Edit Account</button></div>
          <div className="account-fields">
            {['name', 'email', 'department', 'college', 'availability'].map((field) => <label key={field}>{field.charAt(0).toUpperCase() + field.slice(1)}<input type={field === 'email' ? 'email' : 'text'} name={field} value={draftAccount[field] || ''} onChange={handleDraftChange} disabled={!editing} required /></label>)}
          </div>
          <div className="account-status"><span>●</span><div><strong>Profile status</strong><small>Active SkillSwap member</small></div></div>
          {editing ? <div className="account-actions"><button type="button" className="profile-cancel-button" onClick={() => { setDraftAccount(account); setEditing(false); }}>Cancel</button><button type="submit" className="profile-save-button">Save Account</button></div> : null}
        </form>
      </main>
      <AppSidebar current="profile" onNavigate={onNavigate} onLogout={onLogout} />
    </div>
  );
}

function PrivacyScreen({ privacySettings, onSave, onClearNotifications, onBack, onHome, onExplore, onPost, onMessages, onProfile, onNavigate, onLogout, settings, showToast, toastMessage }) {
  return (
    <div className={`privacy-screen ${settings.darkMode ? 'dark-theme' : ''}`}>
      {showToast ? <div className="toast-popup">{toastMessage}</div> : null}
      <header className="settings-screen-header"><button className="settings-back-button" aria-label="Back to Profile" onClick={onBack}>←</button><h1>Privacy &amp; Security</h1><span className="settings-header-spacer" /></header>
      <main className="settings-screen-content">
        <section className="settings-list privacy-settings-list">
          <label className="privacy-control"><span><strong>Keep Profile Public</strong><small>Let other students discover your profile.</small></span><input type="checkbox" checked={privacySettings.profilePublic} onChange={(event) => onSave({ ...privacySettings, profilePublic: event.target.checked })} /><i /></label>
          <label className="privacy-control"><span><strong>Two-Factor Authentication</strong><small>Add an extra layer of account security.</small></span><input type="checkbox" checked={privacySettings.twoFactorEnabled} onChange={(event) => onSave({ ...privacySettings, twoFactorEnabled: event.target.checked })} /><i /></label>
        </section>
        <button className="settings-danger-action" onClick={onClearNotifications}>Clear Notifications</button>
      </main>
      <AppSidebar current="profile" onNavigate={onNavigate} onLogout={onLogout} />
    </div>
  );
}

function HelpScreen({ onBack, onHome, onExplore, onPost, onMessages, onProfile, onNavigate, onLogout, onAction, settings, showToast, toastMessage }) {
  return (
    <div className={`help-screen ${settings.darkMode ? 'dark-theme' : ''}`}>
      {showToast ? <div className="toast-popup">{toastMessage}</div> : null}
      <header className="settings-screen-header"><button className="settings-back-button" aria-label="Back to Profile" onClick={onBack}>←</button><h1>Help &amp; Support</h1><span className="settings-header-spacer" /></header>
      <main className="settings-screen-content">
        <section className="help-card"><div className="help-card-icon">?</div><h2>How can we help?</h2><p>Find answers or contact the SkillSwap AI support team.</p><button onClick={() => onAction('FAQ opened successfully.')}>FAQ <span>→</span></button><button onClick={() => onAction('Contact Support demo opened.')}>Contact Support <span>→</span></button><button onClick={() => onAction('Problem report opened.')}>Report a Problem <span>→</span></button></section>
      </main>
      <AppSidebar current="profile" onNavigate={onNavigate} onLogout={onLogout} />
    </div>
  );
}

function AboutScreen({ settings, onBack, onHome, onExplore, onPost, onMessages, onProfile, onNavigate, onLogout }) {
  return (
    <div className={`about-screen ${settings.darkMode ? 'dark-theme' : ''}`}>
      <header className="about-screen-header">
        <button className="about-back-button" aria-label="Back to dashboard" onClick={onBack}>←</button>
        <h1>About</h1>
        <span className="about-header-spacer" aria-hidden="true" />
      </header>
      <main className="about-screen-content">
        <section className="about-brand" aria-label="About SkillSwap AI">
          <div className="about-logo" aria-hidden="true"><span>✦</span></div>
          <h2>SkillSwap AI</h2>
          <p className="about-tagline">Learn <span>•</span> Share <span>•</span> Grow</p>
        </section>
        <p className="about-description">SkillSwap AI is a student-to-student<br />skill exchange platform that helps you<br />learn new skills, share your skills, and<br />grow together.</p>
        <p className="about-version">Version 1.0.0</p>
        <nav className="about-links" aria-label="About links">
          <a href="#privacy">Privacy Policy <span>›</span></a>
          <a href="#terms">Terms &amp; Conditions <span>›</span></a>
          <a href="mailto:support@skillswap.ai">Contact Us <span>›</span></a>
        </nav>
      </main>
      <AppSidebar current="about" onNavigate={onNavigate} onLogout={onLogout} />
    </div>
  );
}

function PostSkillScreen({ settings, form, onChange, onModeChange, onImageChange, onSubmit, onBack, onExplore, onMessages, onProfile, onNavigate, onLogout }) {
  return (
    <div className={`post-skill-page ${settings.darkMode ? 'dark-theme' : ''}`}>
      <header className="post-skill-header"><div className="container post-skill-header-inner"><button className="screen-icon-button" aria-label="Back to dashboard" onClick={onBack}>←</button><div><span className="dashboard-kicker">SKILLSWAP AI</span><h1>Post Your Skill</h1></div><span className="post-header-mark">✦</span></div></header>
      <main className="container post-skill-content">
        <form className="post-skill-card" onSubmit={onSubmit}>
          <div className="post-mode-toggle" role="tablist" aria-label="Skill post type"><button type="button" className={form.mode === 'teach' ? 'active' : ''} onClick={() => onModeChange('teach')}>I can teach</button><button type="button" className={form.mode === 'learn' ? 'active' : ''} onClick={() => onModeChange('learn')}>I want to learn</button></div>
          <div className="post-form-intro"><span className="dashboard-kicker">SHARE YOUR KNOWLEDGE</span><h2>{form.mode === 'teach' ? 'What can you teach?' : 'What do you want to learn?'}</h2><p>Help the SkillSwap community find the right match.</p></div>
          <label>Skill Name<input name="name" value={form.name} onChange={onChange} placeholder="e.g. React Development" required /></label>
          <label>Description<textarea name="description" value={form.description} onChange={onChange} placeholder="Tell students a little about this skill..." rows="4" required /></label>
          <label>Category<select name="category" value={form.category} onChange={onChange}><option>Technical</option><option>Creative</option><option>Language</option><option>Business</option><option>Wellness</option></select></label>
          <label>Add Tags <span>(optional)</span><input name="tags" value={form.tags} onChange={onChange} placeholder="react, frontend, web" /></label>
          <label className="post-upload">Upload image <span>(optional)</span><input type="file" accept="image/*" onChange={onImageChange} />{form.image ? <img src={form.image} alt="Selected skill preview" /> : <span className="post-upload-placeholder">＋ Choose an image</span>}</label>
          <button className="post-submit-button" type="submit">Post Skill <span>→</span></button>
        </form>
      </main>
      <AppSidebar current="post" onNavigate={onNavigate} onLogout={onLogout} />
    </div>
  );
}

function MessagesScreen({ settings, chats, selectedChatId, setSelectedChatId, search, setSearch, draft, setDraft, onSend, onBack, onExplore, onPost, onProfile, onNavigate, onLogout }) {
  const messageEndRef = useRef(null);
  const selectedChat = chats.find((chat) => chat.id === selectedChatId);
  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(search.trim().toLowerCase()));

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChatId, selectedChat?.messages.length]);

  return (
    <div className={`messages-page ${settings.darkMode ? 'dark-theme' : ''}`}>
      <header className="messages-header"><div className="container messages-header-inner"><button className="screen-icon-button" aria-label="Back to dashboard" onClick={onBack}>←</button><div><span className="dashboard-kicker">SKILLSWAP AI</span><h1>Messages</h1></div><span className="messages-header-mark">◌</span></div></header>
      <main className={`container messages-content ${selectedChat ? 'chat-open' : ''}`}>
        <section className="chat-list-panel"><div className="messages-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search chats..." /></div><div className="chat-list">{filteredChats.map((chat) => <button className={`chat-list-item ${selectedChatId === chat.id ? 'active' : ''}`} key={chat.id} onClick={() => setSelectedChatId(chat.id)}><span className="chat-avatar">{chat.avatar}</span><span className="chat-list-copy"><strong>{chat.name}</strong><small>{chat.lastMessage}</small></span><time>{chat.time}</time></button>)}</div></section>
        {selectedChat ? <section className="chat-window"><div className="chat-window-header"><button className="chat-back-button" onClick={() => setSelectedChatId(null)}>←</button><span className="chat-avatar">{selectedChat.avatar}</span><div><strong>{selectedChat.name}</strong><small>SkillSwap partner</small></div></div><div className="chat-messages">{selectedChat.messages.map((message) => <div className={`chat-bubble-row ${message.from === 'me' ? 'mine' : ''}`} key={message.id}><div className="chat-bubble"><p>{message.text}</p><time>{message.time}</time></div></div>)}<div ref={messageEndRef} /></div><form className="chat-compose" onSubmit={onSend}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message..." aria-label="Message" /><button type="submit" aria-label="Send message">↑</button></form></section> : <section className="chat-empty"><span>◌</span><h2>Select a chat</h2><p>Choose a SkillSwap partner to start messaging.</p></section>}
      </main>
      <AppSidebar current="messages" onNavigate={onNavigate} onLogout={onLogout} />
    </div>
  );
}

function NotificationsScreen({ settings, onBack, onExplore, onPost, onProfile, onNavigate, onLogout }) {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Swap Requests', 'Messages', 'System'];
  const items = [
    { id: 1, filter: 'All', kind: 'like', initials: 'AP', name: 'Aarav Patel', action: 'liked your post', skill: 'UI/UX Design', time: '15m', unread: true },
    { id: 2, filter: 'All', kind: 'comment', initials: 'NS', name: 'Neha Soni', action: 'commented on your post', skill: 'Python Programming', time: '1h', unread: true },
    { id: 3, filter: 'System', kind: 'system', initials: '✦', name: 'System Update', action: 'New feature: AI Skill Match', time: '2h', unread: false },
    { id: 4, filter: 'Messages', kind: 'message', initials: 'PD', name: 'Pooja Desai', action: 'sent a message', skill: 'English Speaking', time: '3h', unread: false },
  ];
  const visibleItems = filter === 'All' ? items : items.filter((item) => item.filter === filter);

  return (
    <div className={`notifications-page ${settings.darkMode ? 'dark-theme' : ''}`}>
      <header className="notifications-header">
        <div className="container notifications-header-inner">
          <button className="notifications-back" aria-label="Back to dashboard" onClick={onBack}>←</button>
          <h1>Notifications</h1>
          <span className="notifications-header-dot" aria-hidden="true" />
        </div>
      </header>
      <main className="container notifications-content">
        <div className="notification-tabs" role="tablist" aria-label="Notification filters">
          {filters.map((item) => <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
        <section className="notification-list" aria-label={`${filter} notifications`}>
          {visibleItems.map((item) => (
            <article className={`notification-card ${item.unread ? 'unread' : ''}`} key={item.id}>
              <div className={`notification-avatar ${item.kind}`}>{item.initials}</div>
              <div className="notification-copy">
                <p><strong>{item.name}</strong> {item.action}</p>
                {item.skill ? <span className="notification-skill">Skill: {item.skill}</span> : null}
                <small>{item.kind === 'system' ? item.action : item.skill}</small>
              </div>
              <time>{item.time}</time>
              {item.unread ? <span className="notification-unread" aria-label="Unread" /> : null}
            </article>
          ))}
          {!visibleItems.length ? <div className="notification-empty">No notifications in this view.</div> : null}
        </section>
      </main>
      <AppSidebar current="notifications" onNavigate={onNavigate} onLogout={onLogout} />
    </div>
  );
}

function ExploreSkillsScreen({ settings, search, setSearch, category, setCategory, skills, onSelectSkill, onBack, onNavigate, onLogout }) {
  const categories = ['All', 'Technical', 'Creative', 'Language'];
  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = category === 'All' || skill.category === category;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${skill.name} ${skill.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`skill-explore-page ${settings.darkMode ? 'dark-theme' : ''}`}>
      <AppSidebar current="explore" onNavigate={onNavigate} onLogout={onLogout} />
      <header className="skill-explore-header">
        <div className="container skill-explore-header-inner">
          <button className="screen-icon-button" aria-label="Back to dashboard" onClick={onBack}>←</button>
          <div><span className="dashboard-kicker">SKILLSWAP AI</span><h1>Explore Skills</h1></div>
          <button className="screen-icon-button" aria-label="Open profile" onClick={onBack}>●</button>
        </div>
      </header>

      <main className="container skill-explore-content">
        <div className="explore-search"><span aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search skills..." /></div>
        <div className="skill-category-chips" role="tablist" aria-label="Skill categories">
          {categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <div className="explore-title-row"><div><span className="dashboard-kicker">DISCOVER SOMETHING NEW</span><h2>Popular skills</h2></div><span>{filteredSkills.length} skills</span></div>
        <div className="explore-skill-grid">
          {filteredSkills.map((skill) => <article className="explore-skill-card" key={skill.id} onClick={() => onSelectSkill(skill)} role="button" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && onSelectSkill(skill)}>
            <div className="explore-skill-card-top"><div className="explore-skill-icon">{skill.icon}</div><span className="explore-category-label">{skill.category}</span></div>
            <h3>{skill.name}</h3>
            <p>{skill.description}</p>
            <div className="explore-skill-card-bottom"><span>◉ {skill.students} students</span><button onClick={(event) => { event.stopPropagation(); onSelectSkill(skill); }}>Swap <span>→</span></button></div>
          </article>)}
        </div>
        {!filteredSkills.length ? <div className="empty-dashboard-state">No skills match your search.</div> : null}
      </main>
    </div>
  );
}

function SkillDetailsScreen({ settings, skill, onBack, onRequestSwap, onNavigate, onLogout }) {
  if (!skill) return null;
  const learnItems = skill.category === 'Technical'
    ? ['Practical foundations and best practices', 'Build a project with guided feedback', 'Confidence using industry tools']
    : skill.category === 'Creative'
      ? ['Creative process and visual thinking', 'Create polished work for your portfolio', 'Feedback from experienced peers']
      : ['Clearer everyday conversations', 'Confidence in presentations', 'Useful vocabulary and feedback'];
  const exchangeItems = skill.category === 'Technical' ? ['HTML, CSS, JavaScript', 'Data analysis', 'Project collaboration'] : skill.category === 'Creative' ? ['Brand strategy', 'Content writing', 'Presentation skills'] : ['Public speaking', 'Writing', 'Interview preparation'];

  const shareSkill = async () => {
    const shareText = `Learn ${skill.name} on SkillSwap AI`;
    if (navigator.share) await navigator.share({ title: skill.name, text: shareText }).catch(() => {});
    else if (navigator.clipboard) await navigator.clipboard.writeText(shareText);
  };

  return (
    <div className={`skill-details-page ${settings.darkMode ? 'dark-theme' : ''}`}>
      <AppSidebar current="explore" onNavigate={onNavigate} onLogout={onLogout} />
      <header className="skill-details-header"><div className="container skill-details-actions"><button className="screen-icon-button" aria-label="Back to Explore" onClick={onBack}>←</button><button className="screen-icon-button" aria-label="Share skill" onClick={shareSkill}>↗</button></div></header>
      <main className="container skill-details-content">
        <div className="skill-details-identity"><div className="skill-details-avatar">{skill.icon}</div><div><span className="explore-category-label">{skill.category}</span><h1>{skill.name}</h1><p>◉ {skill.students} students learning this skill</p></div></div>
        <section className="skill-details-card"><span className="dashboard-kicker">ABOUT THIS SKILL</span><h2>Grow with the community</h2><p>{skill.description}</p></section>
        <section className="skill-details-list"><h2>What you'll learn</h2><ul>{learnItems.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul></section>
        <section className="skill-details-list"><h2>Looking to exchange</h2><ul>{exchangeItems.map((item) => <li key={item}><span>＋</span>{item}</li>)}</ul></section>
        <button className="details-request-button" onClick={onRequestSwap}>Request Swap <span>→</span></button>
      </main>
    </div>
  );
}

export default App;
