// todo-frontend/src/components/PriorityBadge.jsx

function PriorityBadge({ priority }) {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 5:
        return {
          label: 'Critical',
          color: 'bg-red-500',
          textColor: 'text-white',
          icon: '🔴'
        };
      case 4:
        return {
          label: 'High',
          color: 'bg-orange-500',
          textColor: 'text-white',
          icon: '🟠'
        };
      case 3:
        return {
          label: 'Medium',
          color: 'bg-yellow-500',
          textColor: 'text-white',
          icon: '🟡'
        };
      case 2:
        return {
          label: 'Low',
          color: 'bg-green-500',
          textColor: 'text-white',
          icon: '🟢'
        };
      case 1:
        return {
          label: 'Minimal',
          color: 'bg-gray-500',
          textColor: 'text-white',
          icon: '⚪'
        };
      default:
        return {
          label: 'Medium',
          color: 'bg-gray-400',
          textColor: 'text-white',
          icon: '❓'
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.textColor}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
}

export default PriorityBadge;