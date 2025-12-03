# Real-Time GitHub and LeetCode Integration Guide

## 🚀 Quick Start

Your dashboard now fetches **real-time data** from GitHub and LeetCode APIs!

### Step 1: Enter Your Usernames

When you first open the dashboard, you'll see a setup screen:

1. Enter your **GitHub username** (required)
2. Enter your **LeetCode username** (optional)
3. Click "Start Tracking"

Your usernames are saved in localStorage, so you only need to do this once.

### Step 2: View Your Stats

The dashboard will automatically fetch and display:

**From GitHub:**
- Total contributions (estimated from recent activity)
- Current streak (consecutive days with commits)
- Number of public repositories
- Pull requests count
- Total commits
- Monthly contribution chart (last 6 months)
- Recent GitHub activities (pushes, PRs, branches)

**From LeetCode:**
- Total problems solved
- Easy/Medium/Hard breakdown
- Progress bars with percentages
- Global ranking
- Recent solved problems

**Calculated Metrics:**
- Estimated monthly coding hours (based on GitHub activity)
- Average coding hours per day
- Active projects count

## 🔄 Refresh Data

Click the refresh button (↻) in the top right to fetch the latest data at any time.

## ⚙️ Update Settings

Click the settings button (⚙️) to update your GitHub or LeetCode username.

## 📊 What's Being Tracked

### GitHub API Usage
The dashboard uses the GitHub public API to fetch:
- User profile data (`/users/{username}`)
- Recent events (`/users/{username}/events`)
- Repository list (`/users/{username}/repos`)

**Note:** GitHub API has rate limits:
- **Unauthenticated requests:** 60 requests per hour
- **Authenticated requests:** 5,000 requests per hour

### LeetCode API Usage
The dashboard uses LeetCode's GraphQL API to fetch:
- Problem submission statistics
- User ranking
- Recent accepted submissions

**Note:** LeetCode's API is unofficial and may have restrictions. If you experience issues:
1. The dashboard will gracefully handle errors
2. You can still use GitHub-only features
3. LeetCode stats will show as 0 if unavailable

## 🔐 Optional: Increase GitHub Rate Limits

To increase GitHub API rate limits, you can add a personal access token:

### Create a GitHub Token:

1. Go to GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo`, `read:user`
4. Copy the token

### Add Token to the Dashboard:

Edit `/src/api.js` and update the fetch calls:

```javascript
const response = await fetch(`https://api.github.com/users/${username}`, {
  headers: {
    'Authorization': 'token YOUR_GITHUB_TOKEN_HERE'
  }
});
```

**Security Note:** Never commit your token to version control! Use environment variables instead.

## 🛠️ Troubleshooting

### "Failed to fetch data" Error

**Possible causes:**
1. Invalid GitHub username
2. Rate limit exceeded (wait 1 hour or add authentication)
3. Network connectivity issues
4. CORS issues (run the app on a server, not file://)

**Solutions:**
- Verify your username is correct
- Check browser console for detailed errors
- Try refreshing after some time
- Make sure you're running `npm run dev` (not opening index.html directly)

### LeetCode Data Not Loading

LeetCode's API can be finicky. If it doesn't work:
1. Verify your LeetCode username is correct (case-sensitive)
2. Check if you have a public profile on LeetCode
3. The dashboard will still work with GitHub-only data

### No Activities Showing

If you don't see recent activities:
1. Make sure you have recent GitHub activity (commits, PRs, etc.)
2. The dashboard only shows the last 100 events from GitHub
3. Try making a commit and refreshing the dashboard

## 📝 Data Estimation Notes

Some metrics are **estimated** based on available data:

- **Total contributions:** Calculated from recent events × multiplier
- **Total commits:** Based on push events in recent history
- **Coding hours:** Estimated at ~30 minutes per event
- **Monthly data:** Based on events in each month

For more accurate data, consider:
- Using GitHub's official contribution graph API
- Integrating with time-tracking tools (WakaTime, RescueTime)
- Adding more data sources

## 🎨 Customization

You can customize the dashboard by editing `DeveloperDashboard.jsx`:

- Change estimation multipliers in `src/api.js`
- Adjust refresh intervals
- Add more platforms (GitLab, Bitbucket, etc.)
- Customize the color scheme
- Add charts and visualizations

## 📱 CORS Issues?

If you encounter CORS errors with LeetCode:

### Option 1: Use a Proxy
Create a simple proxy server to handle LeetCode requests.

### Option 2: Browser Extension
Use a CORS browser extension for development (not recommended for production).

### Option 3: Backend Integration
Create a backend API that fetches data and serves it to your frontend.

## 🔜 Future Enhancements

Consider adding:
- [ ] WakaTime integration for accurate coding hours
- [ ] GitLab support
- [ ] HackerRank/CodeForces stats
- [ ] Weekly/monthly email reports
- [ ] Data export functionality
- [ ] Historical data storage
- [ ] Contribution heatmap
- [ ] Leaderboard with friends
- [ ] Goal tracking and achievements

## 🤝 Contributing

Want to add more features? Feel free to:
1. Add new data sources
2. Improve data accuracy
3. Add more visualizations
4. Enhance error handling
5. Add caching mechanisms

Enjoy tracking your coding journey! 🚀
