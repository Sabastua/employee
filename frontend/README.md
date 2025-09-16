# Employee Management System - Frontend

A modern, responsive web application for managing employees with comprehensive features including CRUD operations, advanced search, filtering, statistics, and analytics.

## 🚀 Features

### ✨ Core Features
- **Complete CRUD Operations**: Create, Read, Update, Delete employees
- **Advanced Search & Filtering**: Search by name, department, position, status, salary range, and date range
- **Pagination & Sorting**: Efficient data navigation with customizable sorting
- **Real-time Statistics**: Interactive dashboard with charts and analytics
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes with persistent preferences
- **Export Functionality**: Export employee data to CSV format

### 🎨 UI/UX Features
- **Modern Design**: Clean, professional interface with smooth animations
- **Interactive Charts**: Department distribution and status overview with Chart.js
- **Toast Notifications**: User-friendly feedback for all actions
- **Loading States**: Visual feedback during API operations
- **Keyboard Shortcuts**: Power-user features for efficient navigation
- **Form Validation**: Client-side validation with helpful error messages

### 🔧 Technical Features
- **Vanilla JavaScript**: No framework dependencies (except Chart.js for charts)
- **Modular Architecture**: Clean separation of concerns
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Caching**: Smart caching for better performance
- **Accessibility**: WCAG-compliant with keyboard navigation support
- **PWA Ready**: Service worker setup for future offline capabilities

## 📁 File Structure

```
frontend/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS with themes and responsive design
├── api.js             # API service layer (handles all 17 endpoints)
├── ui.js              # UI manager and interactions
├── charts.js          # Charts and data visualization
├── app.js             # Main application coordinator
└── README.md          # This documentation
```

## 🛠️ Setup & Installation

### Prerequisites
- Spring Boot backend running on `http://localhost:8081`
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for external dependencies (Font Awesome, Google Fonts, Chart.js)

### Quick Start

1. **Ensure your Spring Boot backend is running:**
   ```bash
   # From your Spring Boot project directory
   ./gradlew bootRun --args='--server.port=8081'
   ```

2. **Open the frontend:**
   ```bash
   # Navigate to the frontend directory
   cd frontend
   
   # Open index.html in your browser
   # You can use a local server (recommended) or open directly
   
   # Option 1: Using Python's built-in server
   python -m http.server 3000
   
   # Option 2: Using Node.js http-server (if installed)
   npx http-server -p 3000
   
   # Option 3: Direct file opening
   # Double-click index.html or open in browser
   ```

3. **Access the application:**
   - With local server: `http://localhost:3000`
   - Direct file: `file:///path/to/frontend/index.html`

## 🖱️ Usage Guide

### Navigation
- **Dashboard**: Overview with statistics and recent employees
- **Employees**: Full employee management with table view
- **Search & Filter**: Advanced search with multiple criteria
- **Reports**: Detailed analytics and insights

### Employee Management

#### Adding Employees
1. Click "Add Employee" button (or press `Ctrl+N`)
2. Fill in the required fields (marked with *)
3. Click "Save Employee"

#### Editing Employees
1. Click the edit icon (✏️) next to any employee
2. Modify the information
3. Click "Update Employee"

#### Deleting Employees
1. Click the delete icon (🗑️) next to any employee
2. Confirm the deletion in the popup

### Search & Filtering

#### Quick Search
- Type in the search box on the Employees page
- Searches across names, emails, and other fields

#### Advanced Search
1. Go to the "Search & Filter" section
2. Set your criteria:
   - **Text Search**: Name, email, keywords
   - **Department**: Select from dropdown
   - **Position**: Enter job title
   - **Status**: Active, Inactive, On Leave, Terminated
   - **Salary Range**: Min and max salary
   - **Hire Date Range**: From and to dates
3. Click "Search"

#### Filters on Employee Page
- **Department Filter**: Quick filter by department
- **Status Filter**: Filter by employment status
- **Sorting**: Sort by various columns (ID, name, department, etc.)

### Reports & Analytics

#### Dashboard Statistics
- Total employees count
- Active employees
- Number of departments
- Recent hires (last 6 months)
- Department distribution chart
- Employee status chart

#### Advanced Reports
1. **Department Analysis**: Employee distribution by department
2. **Status Overview**: Current employment status breakdown
3. **Salary Analysis**: Set threshold and analyze salary ranges
4. **Hiring Trends**: View hiring patterns by month

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | Add new employee |
| `Ctrl/Cmd + K` | Focus search box |
| `Ctrl/Cmd + Shift + D` | Go to Dashboard |
| `Ctrl/Cmd + Shift + E` | Go to Employees |
| `Ctrl/Cmd + Shift + S` | Go to Search |
| `Ctrl/Cmd + Shift + R` | Go to Reports |
| `Escape` | Close modal or clear search |
| `Ctrl/Cmd + /` | Show keyboard shortcuts help |

## 🎨 Themes

The application supports both light and dark themes:
- Click the theme toggle button (🌙/☀️) in the navigation
- Theme preference is automatically saved
- Charts and all UI elements adapt to the selected theme

## 📊 API Integration

The frontend integrates with all 17 backend API endpoints:

### CRUD Operations
- `POST /api/employees` - Create employee
- `GET /api/employees` - Get all employees (paginated)
- `GET /api/employees/{id}` - Get employee by ID
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Search & Filter
- `GET /api/employees/search` - Search employees
- `GET /api/employees/department/{dept}` - Filter by department
- `GET /api/employees/position/{position}` - Filter by position
- `GET /api/employees/status/{status}` - Filter by status

### Advanced Filters
- `GET /api/employees/hired-between` - Employees hired between dates
- `GET /api/employees/recently-hired/{months}` - Recently hired
- `GET /api/employees/salary/greater-than/{amount}` - High earners
- `GET /api/employees/salary/between` - Salary range

### Statistics
- `GET /api/employees/statistics/departments` - Department stats
- `GET /api/employees/statistics/status` - Status stats

## 🔧 Configuration

### API Configuration
Edit `api.js` to change the backend URL:
```javascript
this.baseURL = 'http://localhost:8081/api/employees';
```

### UI Preferences
The application automatically saves user preferences:
- Theme selection
- Page size
- Default sorting
- Form preferences

## 🐛 Troubleshooting

### Common Issues

#### API Connection Errors
- **Issue**: "Network error or server unavailable"
- **Solution**: Ensure Spring Boot backend is running on port 8081
- **Check**: Open `http://localhost:8081/api/employees` in browser

#### CORS Errors
- **Issue**: Cross-origin requests blocked
- **Solution**: Ensure your Spring Boot backend has CORS enabled
- **Note**: The backend should include `@CrossOrigin(origins = "*")` annotation

#### Charts Not Loading
- **Issue**: Charts appear as empty boxes
- **Solution**: Ensure Chart.js CDN is accessible
- **Check**: Internet connection and CDN availability

#### Form Validation Errors
- **Issue**: Form won't submit despite filled fields
- **Solution**: Check browser console for validation errors
- **Note**: All fields marked with * are required

### Browser Compatibility
- **Chrome**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Edge**: Full support
- **IE**: Not supported (use modern browser)

## 🚀 Performance Tips

1. **Use pagination** for large datasets (default: 10 items per page)
2. **Enable caching** - API responses are cached for 1 minute
3. **Use filters** instead of loading all employees at once
4. **Clear search** when not needed to improve performance

## 🔒 Security Notes

- All API requests include proper headers
- Form validation prevents malicious input
- No sensitive data is stored in localStorage
- CORS configuration should be properly set on backend

## 🎯 Future Enhancements

- **PWA Support**: Offline functionality with service workers
- **Multi-language Support**: Internationalization (i18n)
- **Advanced Charts**: More detailed analytics and visualizations
- **Print Support**: Formatted printing of employee reports
- **Email Integration**: Direct email communication
- **Photo Upload**: Employee profile pictures

## 🤝 Contributing

To extend or modify the application:

1. **Adding new features**: Create new methods in appropriate classes
2. **Styling changes**: Modify CSS variables in `:root` for consistent theming
3. **New API endpoints**: Add methods to `api.js` and corresponding UI in `ui.js`
4. **New charts**: Extend `charts.js` with additional visualization methods

## 📄 License

This project is part of the Employee Management System and follows the same license as the parent project.

## 🆘 Support

For support or questions:
1. Check the browser console for error messages
2. Verify backend API is accessible
3. Ensure all required files are in the frontend directory
4. Check network connectivity for external dependencies

---

**Enjoy managing your employees with this modern, feature-rich application! 🎉**
