import Select from '../components/ui/Select';

// Create a wrapper component for main content
const ContentWrapper = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 sm:p-6 h-full ${className}`}>
      {children}
    </div>
  );
};

// Inside your component
const branchOptions = branches.map(branch => ({
  value: branch.id,
  label: branch.name
}));

<Select
  options={branchOptions}
  value={selectedBranch}
  onChange={(e) => setSelectedBranch(e.target.value)}
  placeholder="Select Branch"
/>

{/* Make sure the main content area has a lower z-index than the dropdown */}
<main className="relative z-0 flex-1 overflow-y-auto">
  {/* Main content */}
</main>