#!/usr/bin/env bash

# Resolve Python binary path inside the backend virtual environment (relative to the backend directory)
if [ -f "backend/.venv/Scripts/python.exe" ]; then
  PYTHON_BIN=".venv/Scripts/python.exe"
elif [ -f "backend/.venv/bin/python" ]; then
  PYTHON_BIN=".venv/bin/python"
else
  PYTHON_BIN="python"
fi

echo "=========================================="
echo "1. Running Backend Test Suite with pytest-cov..."
echo "=========================================="
cd backend
$PYTHON_BIN -m pytest --cov=. --cov-report=term --cov-report=json:coverage.json
BACKEND_EXIT=$?
cd ..

echo ""
echo "=========================================="
echo "2. Running Frontend Test Suite with Vitest coverage..."
echo "=========================================="
cd frontend
npx vitest run --coverage
FRONTEND_EXIT=$?
cd ..

echo ""
echo "=========================================="
echo "3. Consolidating Coverage Metrics..."
echo "=========================================="

# Run inline Node script to parse JSON coverage files and display consolidated results
node -e "
const fs = require('fs');
const path = require('path');

let backendPctStr = 'N/A';
let frontendPctStr = 'N/A';
let backendPct = null;
let frontendPct = null;

// Parse backend coverage
try {
  const backendPath = path.join('backend', 'coverage.json');
  if (fs.existsSync(backendPath)) {
    const backendData = JSON.parse(fs.readFileSync(backendPath, 'utf8'));
    if (backendData.totals && backendData.totals.percent_covered !== undefined) {
      backendPct = parseFloat(backendData.totals.percent_covered);
      backendPctStr = backendPct.toFixed(2) + '%';
    }
  }
} catch (e) {
  console.warn('Warning: Failed to parse backend coverage.json:', e.message);
}

// Parse frontend coverage
try {
  const frontendPath = path.join('frontend', 'coverage', 'coverage-summary.json');
  if (fs.existsSync(frontendPath)) {
    const frontendData = JSON.parse(fs.readFileSync(frontendPath, 'utf8'));
    if (frontendData.total && frontendData.total.statements && frontendData.total.statements.pct !== undefined) {
      frontendPct = parseFloat(frontendData.total.statements.pct);
      frontendPctStr = frontendPct.toFixed(2) + '%';
    }
  }
} catch (e) {
  console.warn('Warning: Failed to parse frontend coverage-summary.json:', e.message);
}

console.log('==================================================');
console.log('          COMBINED TEST COVERAGE SUMMARY');
console.log('==================================================');
console.log('  Backend Coverage (pytest-cov):   ' + backendPctStr);
console.log('  Frontend Coverage (vitest-cov):  ' + frontendPctStr);

if (backendPct !== null && frontendPct !== null) {
  const combinedAvg = (backendPct + frontendPct) / 2;
  console.log('  ----------------------------------------------');
  console.log('  Combined Average Coverage:       ' + combinedAvg.toFixed(2) + '%');
}
console.log('==================================================');
"

# Exit with non-zero if either suite failed
if [ $BACKEND_EXIT -ne 0 ] || [ $FRONTEND_EXIT -ne 0 ]; then
  echo "Error: One or more test suites failed."
  exit 1
else
  echo "Success: All test suites passed."
  exit 0
fi
