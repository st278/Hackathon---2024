// tracker.js

// Load existing goal from localStorage if available
document.addEventListener('DOMContentLoaded', () => {
    const savedGoal = JSON.parse(localStorage.getItem('goal'));
    if (savedGoal) {
      document.getElementById('goal-name').value = savedGoal.name;
      document.getElementById('goal-total').value = savedGoal.target;
      document.getElementById('goal-progress').value = savedGoal.progress;
    }
  });
  
  // Save the goal to localStorage and display a success message
  function saveGoal() {
    const name = document.getElementById('goal-name').value;
    const target = parseInt(document.getElementById('goal-total').value, 10);
    const progress = parseInt(document.getElementById('goal-progress').value, 10);
  
    if (name && target > 0) {
      const goal = { name, target, progress };
      localStorage.setItem('goal', JSON.stringify(goal));
      document.getElementById('tracker-message').textContent = 'Goal saved successfully!';
    } else {
      document.getElementById('tracker-message').textContent = 'Please enter a valid goal and target.';
    }
  }
  