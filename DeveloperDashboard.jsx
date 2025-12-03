import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Code, 
  Clock, 
  FolderGit2, 
  GitBranch, 
  GitPullRequest, 
  GitCommit, 
  Flame,
  Target,
  Calendar,
  Award,
  Zap,
  RefreshCw,
  Settings
} from 'lucide-react';
import { fetchGitHubStats, fetchLeetCodeStats, calculateCodingHours } from './src/api';

const DeveloperDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [githubUsername, setGithubUsername] = useState(localStorage.getItem('githubUsername') || '');
  const [leetcodeUsername, setLeetcodeUsername] = useState(localStorage.getItem('leetcodeUsername') || '');
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // Fetch data from APIs
  const fetchData = async () => {
    if (!githubUsername) {
      setError('Please set your GitHub username in settings');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch GitHub data
      const githubData = await fetchGitHubStats(githubUsername);
      const codingHours = calculateCodingHours(githubData.activities || []);

      // Fetch LeetCode data
      let leetcodeData = {
        totalSolved: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        ranking: 'N/A',
        easyTotal: 825,
        mediumTotal: 1725,
        hardTotal: 750,
        activities: []
      };

      if (leetcodeUsername) {
        try {
          leetcodeData = await fetchLeetCodeStats(leetcodeUsername);
        } catch (err) {
          console.error('LeetCode fetch failed:', err);
        }
      }

      // Merge activities
      const allActivities = [
        ...(githubData.activities || []),
        ...(leetcodeData.activities || [])
      ].sort((a, b) => {
        // Simple time-based sorting (newer first)
        const timeA = a.time.includes('hour') ? 1 : a.time.includes('day') ? 2 : 0;
        const timeB = b.time.includes('hour') ? 1 : b.time.includes('day') ? 2 : 0;
        return timeA - timeB;
      }).slice(0, 6);

      setStats({
        github: githubData,
        leetcode: leetcodeData,
        coding: {
          ...codingHours,
          activeProjects: 8,
          totalRepos: githubData.repositories
        }
      });

      setMonthlyData(githubData.monthlyData || []);
      setActivities(allActivities);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      setLoading(false);
    }
  };

  // Load data on mount and when usernames change
  useEffect(() => {
    if (githubUsername) {
      fetchData();
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('githubUsername', githubUsername);
    localStorage.setItem('leetcodeUsername', leetcodeUsername);
    setShowSettings(false);
    fetchData();
  };

  const maxContributions = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.contributions)) : 1;

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'bg-green-500',
      'Medium': 'bg-orange-500',
      'Hard': 'bg-red-500'
    };
    return colors[difficulty] || 'bg-gray-500';
  };

  const getIconComponent = (iconName) => {
    const icons = {
      GitCommit,
      GitPullRequest,
      GitBranch,
      Code
    };
    return icons[iconName] || Code;
  };

  if (!stats && !loading && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to Developer Dashboard</h2>
          <p className="text-gray-300 mb-6">Configure your GitHub and LeetCode usernames to get started.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub Username</label>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="octocat"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">LeetCode Username (Optional)</label>
              <input
                type="text"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                placeholder="username"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              onClick={handleSaveSettings}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Start Tracking
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading your stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-red-500/50 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => setShowSettings(true)}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Update Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-8 border border-white/20 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">GitHub Username</label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="octocat"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">LeetCode Username</label>
                <input
                  type="text"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value)}
                  placeholder="username"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Developer Dashboard</h1>
                <p className="text-gray-400 mt-1">Track your coding journey across platforms</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchData}
                disabled={loading}
                className="p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/20"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/20"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* GitHub Contributions Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <GitBranch className="w-6 h-6 text-purple-400" />
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                +{stats.github.streakIncrease}%
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">GitHub Contributions</h3>
            <p className="text-3xl font-bold text-white mb-3">{stats.github.contributions}</p>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">{stats.github.currentStreak} day streak</span>
            </div>
          </div>

          {/* LeetCode Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Code className="w-6 h-6 text-orange-400" />
              </div>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold">
                Top 5%
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">LeetCode Problems</h3>
            <p className="text-3xl font-bold text-white mb-3">{stats.leetcode.totalSolved}</p>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                E: {stats.leetcode.easy}
              </span>
              <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
                M: {stats.leetcode.medium}
              </span>
              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
                H: {stats.leetcode.hard}
              </span>
            </div>
          </div>

          {/* Coding Hours Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Coding Hours</h3>
            <p className="text-3xl font-bold text-white mb-3">{stats.coding.monthlyHours}h</p>
            <div className="text-sm text-gray-300">
              <span className="text-blue-400 font-semibold">{stats.coding.avgPerDay}h</span> avg per day
            </div>
          </div>

          {/* Active Projects Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <FolderGit2 className="w-6 h-6 text-pink-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Active Projects</h3>
            <p className="text-3xl font-bold text-white mb-3">{stats.coding.activeProjects}</p>
            <div className="text-sm text-gray-300">
              <span className="text-pink-400 font-semibold">{stats.coding.totalRepos}</span> total repos
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-white/20">
                {['overview', 'github', 'leetcode'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-b-2 border-purple-500'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6">Monthly Contributions</h3>
                    <div className="space-y-4">
                      {monthlyData.map((data, index) => (
                        <div key={index} className="group">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 font-medium">{data.month}</span>
                            <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {data.contributions}
                            </span>
                          </div>
                          <div className="relative h-8 bg-white/5 rounded-lg overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transition-all duration-500 group-hover:from-purple-400 group-hover:to-pink-400"
                              style={{ width: `${(data.contributions / maxContributions) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'github' && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6">GitHub Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-2">
                          <FolderGit2 className="w-5 h-5 text-purple-400" />
                          <span className="text-gray-400 text-sm">Repositories</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.github.repositories}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-2">
                          <GitPullRequest className="w-5 h-5 text-purple-400" />
                          <span className="text-gray-400 text-sm">Pull Requests</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.github.pullRequests}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-2">
                          <GitCommit className="w-5 h-5 text-purple-400" />
                          <span className="text-gray-400 text-sm">Total Commits</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.github.commits}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-2">
                          <Flame className="w-5 h-5 text-orange-400" />
                          <span className="text-gray-400 text-sm">Longest Streak</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.github.longestStreak}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'leetcode' && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6">LeetCode Progress</h3>
                    <div className="space-y-6">
                      {/* Easy Problems */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-green-400 font-semibold">Easy</span>
                          <span className="text-white font-semibold">
                            {stats.leetcode.easy}/{stats.leetcode.easyTotal} ({Math.round((stats.leetcode.easy / stats.leetcode.easyTotal) * 100)}%)
                          </span>
                        </div>
                        <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                            style={{ width: `${(stats.leetcode.easy / stats.leetcode.easyTotal) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Medium Problems */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-orange-400 font-semibold">Medium</span>
                          <span className="text-white font-semibold">
                            {stats.leetcode.medium}/{stats.leetcode.mediumTotal} ({Math.round((stats.leetcode.medium / stats.leetcode.mediumTotal) * 100)}%)
                          </span>
                        </div>
                        <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                            style={{ width: `${(stats.leetcode.medium / stats.leetcode.mediumTotal) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Hard Problems */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-red-400 font-semibold">Hard</span>
                          <span className="text-white font-semibold">
                            {stats.leetcode.hard}/{stats.leetcode.hardTotal} ({Math.round((stats.leetcode.hard / stats.leetcode.hardTotal) * 100)}%)
                          </span>
                        </div>
                        <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-500"
                            style={{ width: `${(stats.leetcode.hard / stats.leetcode.hardTotal) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Global Ranking */}
                      <div className="mt-8 p-6 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl border border-orange-500/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Award className="w-8 h-8 text-yellow-400" />
                            <div>
                              <p className="text-gray-400 text-sm">Global Ranking</p>
                              <p className="text-2xl font-bold text-white">#{stats.leetcode.ranking}</p>
                            </div>
                          </div>
                          <Target className="w-12 h-12 text-yellow-400/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Feed Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const Icon = getIconComponent(activity.icon);
                  return (
                    <div
                      key={index}
                      className="group p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex gap-3">
                        <div className={`p-2 bg-${activity.color}-500/20 rounded-lg h-fit`}>
                          <Icon className={`w-4 h-4 text-${activity.color}-400`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm group-hover:text-purple-400 transition-colors duration-300">
                            {activity.action}
                          </p>
                          {activity.project && (
                            <p className="text-gray-400 text-xs mt-1">
                              in <span className="text-purple-400">{activity.project}</span>
                            </p>
                          )}
                          {activity.difficulty && (
                            <span className={`inline-block mt-2 px-2 py-1 ${getDifficultyColor(activity.difficulty)} text-white text-xs rounded-full`}>
                              {activity.difficulty}
                            </span>
                          )}
                          <p className="text-gray-500 text-xs mt-2">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
