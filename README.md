# Office Tools Kit

---

##  Features

###  Dual AI Chatbots

1. **General Assistant** – For everyday questions and tasks
2. **Technical Specialist** – For coding and technical queries

### Grammar & Spell Checker

- Real-time error detection
- Contextual suggestions
- Multiple replacement options
- Supports Grammar & Punctuation Rule

###  Translation Service

- Multi-language support
- Preserves formatting
- Fast batch processing
- Context-aware translations

---

##  Tech Stack

- **Frontend:** ReactJS, Tailwind CSS
- **Backend:** Node.js 
- **APIs:** AWS Translate , OpenAI , DeepSeek, Language Tools
- **DevOps:** GitHub Actions
- **Linting** :   ESLint
- **Unit Testing** : Jest  
- **Security Scans**:    OWASP , GitLeaks 
- **Dev Environment** :   GitHub Code Spaces
- **Cloud  SP**:  Render Cloud

---

## 🌿 Branch Strategy

We follow a **Gitflow-based** workflow:

- `main`: Contains independent, almost‐stable features; serves as a clean draft for semi-finalized code staged in Render Cloud to ensure compatibility and efficiency.
- `release/v1.0.0`: Holds the production-deployed code on Render Cloud; represents the stable, error-free completed version of the application.
- `development`: Hosts features under active development that are not yet finalized; once stable, changes are merged into `main`.
- `feature`: A dedicated branch off `development` where new features are implemented and once complete, merged back into `development` to continue integration.
- `errors`: A hotfix branch for immediately addressing critical production bugs in `release/v1.0.0`, ensuring stability of the live deployment.
- `cold-fix`: A maintenance branch for correcting issues found in `development` before they impact the main integration workflow.

---
![Flowcharts - Page 4 (1)](https://github.com/user-attachments/assets/b2b3e3c8-dc7a-465e-ac3c-7d09ba88fe6c)



## Getting Started 

## Requirements 

- Git 
- NodeJS 
- Nginx ( Deployment-only )

###  Clone the Repository

```bash
git clone https://github.com/Abdullah-Alalawi/Office_Tools_Project
```

###  Install Dependencies

```bash
cd Office_Tools_Project
npm install
```

### Start Development Server ( Locally )

```bash
npm start
```

###  Build for Production (Server-settings)

```bash
npm run build
```

## Server Deployment (Server-settings)

To serve your React production build via Nginx, follow these steps:

1. **Update Nginx root directive** to point to your React `build/` folder:
   ```bash
   sudo sed -i 's|root /usr/share/nginx/html;|root /path/to/your/project/Office_Tools_Kit/build;|' /etc/nginx/sites-available/default
   ```
2. **Test Nginx configuration** for errors:
   ```bash
   sudo nginx -t
   ```
3. **Restart Nginx** to apply changes:
   ```bash
   sudo systemctl restart nginx
   ```
4. **Or Reload Nginx**  easily without downtime:
   ```bash
   sudo nginx -s reload
   ```

##  Running Tests

```bash
npm test        # For Jest Tests

npm run lint    # For ESLint Tests
```

## 🗂 Folder Structure

```
Office_Tools_Kit/
├── __mocks__/          # mocks for jest tests
├── .guthub/            # GitHub Actions yml files  
├── public/             # Static assets
├── src/
│   ├── CommonElements/ # Shared UI components
│   ├── CommonTests/    # Jest Unit & integration tests
│   ├── Pages/          # The Swrvices pages
│   ├── App.js          # Routing Page
│   └── index.js        # Root component
├── Dockerfile          # Dev Container Configuration
├── .eslintrc.json      # ESLint Configuration
├── jest.config.js      # Jest configuration
├── babel.config.js     # babel configuration
├── package.json        # Project metadata & scripts
└── README.md           # Project documentation
```

##  Acknowledgements

- [https://www.youtube.com/watch?v=wGRF3GQ4Wdk](https://www.youtube.com/watch?v=wGRF3GQ4Wdk) 
