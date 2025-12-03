# Developer Activity Tracker Dashboard

A modern, interactive personal developer activity tracker dashboard built with React and Tailwind CSS. This dashboard displays coding statistics from multiple platforms including GitHub contributions, LeetCode problems solved, and general coding metrics.

## Features

### Design
- **Dark Theme**: Beautiful gradient background from slate-900 to purple-900
- **Glassmorphism Effects**: Backdrop blur on all cards for a premium look
- **Smooth Animations**: Cards scale up on hover with smooth transitions
- **Vibrant Color Palette**: Purple, pink, orange, blue, and yellow accents
- **Fully Responsive**: Built with Tailwind CSS for perfect responsiveness

### Components

#### Header Section
- App title "Developer Dashboard" with Activity icon
- Gradient icon container (purple to pink)
- Descriptive subtitle

#### Four Main Stat Cards
1. **GitHub Contributions** (Purple theme)
   - Total contributions
   - Current streak with lightning icon
   - Percentage increase badge

2. **LeetCode Problems** (Orange theme)
   - Total solved problems
   - Breakdown of easy/medium/hard
   - Ranking badge

3. **Coding Hours** (Blue theme)
   - Monthly hours
   - Average per day

4. **Active Projects** (Pink theme)
   - Current active projects
   - Total repositories

#### Tabbed Content Area
- **Overview Tab**: Animated bar chart showing monthly contribution data with hover tooltips
- **GitHub Tab**: Grid of detailed GitHub stats (repositories, pull requests, commits, streak)
- **LeetCode Tab**: Progress bars for each difficulty level with percentages, global ranking display

#### Activity Feed Sidebar
- Recent activities from both platforms
- Color-coded difficulty badges for LeetCode
- Icons, descriptions, timestamps, and metadata for each activity
- Activities include: GitHub pushes, merged PRs, LeetCode problems solved

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

## Tech Stack

- **React** - UI library with hooks (useState for tab switching)
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool and dev server

## Color Scheme

- **Background**: Gradient from slate-900 through purple-900
- **Cards**: White/10 opacity with backdrop blur
- **Accents**: purple-500, pink-500, orange-400, blue-400, yellow-400
- **Text**: White for headings, gray-300/400 for secondary text
- **Borders**: white/20 that change color on hover

## Customization

You can customize the dashboard by modifying the sample data in the `stats` object within the component. Update the values to reflect your actual coding statistics from GitHub and LeetCode.

## License

MIT
# personal-tracker
