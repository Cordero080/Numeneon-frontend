// QuickSettings.jsx - Settings button grid for profile card back
// 🔵 PABLO - UI/Styling

import './QuickSettings.scss';
import { ShieldIcon, AppearanceIcon, EditIcon, BookmarkIcon, DocumentIcon, MusicIcon } from '@assets/icons';

function QuickSettings() {
  return (
    <div className="quick-settings">
      <h3 className="settings-title">Quick Settings</h3>
      <button className="setting-btn">
        <ShieldIcon size={18} />
        <span>Privacy Settings</span>
      </button>
      <button className="setting-btn">
        <AppearanceIcon size={18} />
        <span>Appearance</span>
      </button>
      <button className="setting-btn">
        <EditIcon size={18} />
        <span>Edit Profile</span>
      </button>
      
      {/* Compact 3-column grid for secondary actions */}
      <div className="settings-grid">
        <button className="setting-btn setting-btn-compact">
          <BookmarkIcon size={16} />
          <span>Saved</span>
        </button>
        <button className="setting-btn setting-btn-compact">
          <DocumentIcon size={16} />
          <span>Activity</span>
        </button>
        <button className="setting-btn setting-btn-compact throwback-btn">
          <MusicIcon size={16} />
          <span>🎸</span>
        </button>
      </div>
    </div>
  );
}

export default QuickSettings;
