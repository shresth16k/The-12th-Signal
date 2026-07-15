try {
  const AxeBuilder = require('@axe-core/playwright').default;
  console.log("Loaded default:", typeof AxeBuilder);
} catch (e) {
  console.log("Default failed:", e.message);
}
try {
  const { AxeBuilder } = require('@axe-core/playwright');
  console.log("Loaded destructure:", typeof AxeBuilder);
} catch (e) {
  console.log("Destructure failed:", e.message);
}
