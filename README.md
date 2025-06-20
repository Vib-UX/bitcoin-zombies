# 🧟‍♂️ Bitcoin Zombies

> Learn Arch blockchain programming through interactive, zombie-themed lessons!

Bitcoin Zombies is an interactive learning platform that teaches you how to build programs on the Arch blockchain. Inspired by CryptoZombies, this platform provides hands-on coding experience with real-time feedback and step-by-step guidance.

## 🚀 Features

- **Interactive Code Editor**: Write and test Arch programs directly in your browser using Monaco Editor
- **Real-time Compilation**: Instant feedback on your code with integrated Rust compiler
- **Step-by-step Lessons**: Progressive learning with guided tutorials
- **Beautiful UI**: Modern, dark-themed interface built with Next.js and Tailwind CSS
- **Docker Support**: Containerized backend for consistent development environment

## 🏗️ Project Structure

```
bitcoin-zombies/
├── frontend/                     # React app with Monaco code editor
│   ├── pages/
│   │   ├── index.tsx            # Homepage with lesson navigation
│   │   └── lesson1.tsx          # Arch Hello World lesson page
│   ├── components/
│   │   ├── CodeEditor.tsx       # Monaco editor component
│   │   ├── ConsoleOutput.tsx    # Console logs / msg! output
│   │   └── LessonSteps.tsx      # Step-by-step instructional UI
│   ├── styles/
│   │   └── globals.css          # Global styles with Tailwind
│   └── tailwind.config.js       # Tailwind configuration
├── backend/                     # Rust microservice
│   ├── Dockerfile              # Container for Arch runner environment
│   ├── main.rs                 # HTTP server (Axum)
│   └── arch_runner.rs          # Compiles/tests Arch programs
├── arch-lessons/               # Arch program lessons
│   └── hello_world_program/
│       ├── Cargo.toml
│       ├── src/
│       │   └── lib.rs          # Complete Hello World Arch program
│       └── tests/
│           └── integration_test.rs
├── tests/
│   └── runner.sh               # Test runner for all lessons
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+
- Rust 1.75+
- Docker (optional, for containerized backend)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend
cargo run
```

The backend API will be available at `http://localhost:8080`

#### Using Docker

```bash
cd backend
docker build -t bitcoin-zombies-backend .
docker run -p 8080:8080 bitcoin-zombies-backend
```

### Running Tests

Test all Arch program lessons:

```bash
chmod +x tests/runner.sh
./tests/runner.sh
```

## 🎮 How to Use

1. **Start the Backend**: Run the Rust backend server
2. **Start the Frontend**: Launch the Next.js development server
3. **Open Your Browser**: Navigate to `http://localhost:3000`
4. **Choose a Lesson**: Start with "Hello World" to learn the basics
5. **Code & Learn**: Write Arch programs in the browser and see instant results

## 📚 Lessons

### Lesson 1: Hello World

- Learn basic Arch program structure
- Understanding the `entrypoint!` macro
- Using `msg!` for program logging
- Program execution flow

_More lessons coming soon!_

## 🔧 Development

### Adding New Lessons

1. Create a new directory in `arch-lessons/`
2. Add the Arch program code in `src/lib.rs`
3. Include tests in `tests/`
4. Create a corresponding lesson page in `frontend/pages/`
5. Update the lessons list in `frontend/pages/index.tsx`

### API Endpoints

- `POST /api/run-arch` - Compile and run Arch program code
- `GET /health` - Backend health check

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-lesson`)
3. Commit your changes (`git commit -m 'Add amazing new lesson'`)
4. Push to the branch (`git push origin feature/amazing-lesson`)
5. Open a Pull Request

### Contribution Ideas

- 📖 New lessons and tutorials
- 🐛 Bug fixes and improvements
- 🎨 UI/UX enhancements
- 📝 Documentation improvements
- 🧪 Additional test cases

## 🔗 Resources

- [Arch Documentation](https://docs.arch.so/)
- [Rust Programming Language](https://doc.rust-lang.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [CryptoZombies](https://cryptozombies.io/)
- Built with the amazing Arch blockchain technology
- Thanks to the Rust and TypeScript communities

---

**Ready to become an Arch blockchain developer? Start your journey with Bitcoin Zombies! 🧟‍♂️⚡**
