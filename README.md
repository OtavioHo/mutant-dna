# DNA Mutant Detector 🧬

A full-stack application for detecting mutant DNA sequences and providing statistical analysis. Built with modern technologies and best practices for scalability, performance, and maintainability.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Algorithm Explanation](#algorithm-explanation)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)

---

## 🎯 Overview

This application analyzes DNA sequences to determine if they belong to a mutant. A DNA sequence is considered mutant if it contains **more than one sequence of four identical letters** in any direction (horizontal, vertical, or diagonal).

---

## 🏛️ Architecture

### System Design

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Frontend  │ ───▶ │   Backend   │ ───▶ │  PostgreSQL  │
│  (React)    │      │  (Fastify)  │      │   Database   │
└─────────────┘      └─────────────┘      └──────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │    Redis    │
                     │    Cache    │
                     └─────────────┘
```

### Backend Architecture

The backend follows **Clean Architecture** principles with clear separation of concerns:

```
backend/src/
├── mutants/
│   ├── container/        # Dependency injection
│   ├── controllers/      # HTTP layer
│   ├── services/         # Business logic
│   ├── repositories/     # Data access
│   └── routes/           # Route definitions
├── stats/
│   └── [same structure]
└── infra/
    ├── cache/            # Redis provider
    └── database/         # PostgreSQL provider
```

### Frontend Architecture

The frontend uses **Feature-Based Architecture** for scalability:

```
frontend/src/
├── features/             # Feature modules
│   ├── mutant-detector/
│   └── stats/
├── components/           # Reusable UI components
│   └── ui/
├── api/                  # API client layer
├── utils/                # Helper functions
├── types/                # TypeScript types
└── constants/            # App constants
```

---

## 🧮 Algorithm Explanation

### Mutant Detection Algorithm

The algorithm analyzes DNA sequences in **four directions** to find sequences of 4 identical consecutive letters:

1. **Horizontal** (left to right)
2. **Vertical** (top to bottom)
3. **Diagonal** (top-left to bottom-right)
4. **Diagonal** (top-right to bottom-left)

### Example

```
A T G C G A
C A G T G C
T T A T G T
A G A A G G    ← Found sequence (AAAA horizontal)
C C C C T A    ← Found sequence (CCCC horizontal)
T C A C T G
```

This DNA is **mutant** because it has more than one sequence of 4 identical letters.

### Time Complexity Analysis

#### Best Case: **O(n²)**
- When mutant sequences are found early
- Early termination when 2 sequences are detected

#### Average/Worst Case: **O(n²)**
- Must scan all positions in the matrix
- Each direction scan is O(n²)
- Four direction scans: 4 × O(n²) = O(n²)

**Where n = size of the DNA matrix**

#### Space Complexity: **O(1)**
- Only uses constant extra space
- No additional data structures needed
- In-place scanning

### Algorithm Pseudocode

```
function isMutant(dna):
    sequenceCount = 0
    TARGET = 2
    SEQUENCE_SIZE = 4
    
    // Check all four directions
    for each direction in [horizontal, vertical, diag1, diag2]:
        for each line in direction:
            count = 1
            for each position in line:
                if current == previous:
                    count++
                    if count == SEQUENCE_SIZE:
                        sequenceCount++
                        if sequenceCount >= TARGET:
                            return true  // Early termination
                else:
                    count = 1
    
    return sequenceCount >= TARGET
```

### Optimizations

- ✅ **Early termination** - Stops after finding 2 sequences
- ✅ **Single pass** - Each cell visited once per direction
- ✅ **No backtracking** - Linear scan in each direction
- ✅ **Minimal memory** - Only counter variables needed

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000
```

### Endpoints

#### 1. **POST /mutants**

Analyzes a DNA sequence to determine if it's mutant.

**Request:**
```http
POST /mutants
Content-Type: application/json

{
  "dna": ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"]
}
```

**Responses:**

**200 OK** - Mutant detected
```json
{
  "message": "Mutant detected"
}
```

**403 Forbidden** - Human DNA
```json
{
  "message": "Human DNA"
}
```

**400 Bad Request** - Invalid DNA
```json
{
  "message": "Invalid DNA sequence"
}
```

---

#### 2. **GET /stats**

Returns statistics about DNA sequences analyzed.

**Request:**
```http
GET /stats
```

**Response: 200 OK**
```json
{
  "count_mutant_dna": 40,
  "count_human_dna": 100,
  "ratio": 0.4
}
```

**Fields:**
- `count_mutant_dna`: Total mutant DNA sequences detected
- `count_human_dna`: Total human DNA sequences detected
- `ratio`: Ratio of mutants to total sequences

---

#### 3. **GET /**

Health check endpoint.

**Request:**
```http
GET /
```

**Response: 200 OK**
```json
{
  "message": "Welcome to the Mutant Detection API"
}
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Docker** >= 20.x
- **Docker Compose** >= 2.x

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd dna-mutant
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

---

## 🏃 Running the Application

### Option 1: Docker Compose (Recommended)

The easiest way to run the entire stack:

```bash
# From the root directory
docker-compose up -d
```

**Services:**
- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

**Stop the application:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f
```

**Rebuild after changes:**
```bash
docker-compose up -d --build
```

---

### Option 2: Local Development

#### Backend

```bash
cd backend

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run migrate

# Start in development mode
npm run dev

# Or build and run production
npm run build
npm start
```

**Backend runs on:** http://localhost:3000

#### Frontend

```bash
cd frontend

# Start development server
npm run dev

# Or build and preview
npm run build
npm run preview
```

**Frontend runs on:** http://localhost:5173 (dev) or http://localhost:4173 (preview)
