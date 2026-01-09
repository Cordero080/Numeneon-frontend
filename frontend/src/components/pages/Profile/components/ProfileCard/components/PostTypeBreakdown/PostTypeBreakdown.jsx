// PostTypeBreakdown.jsx - Donut chart showing content mix
// 🔵 PABLO - UI/Styling

import { useMemo } from 'react';
import './PostTypeBreakdown.scss';

function PostTypeBreakdown({ postTypeData }) {
  // Pre-calculate cumulative percentages to avoid mutation during render
  const segments = useMemo(() => {
    const result = [];
    postTypeData.reduce((cumulative, item) => {
      result.push({ ...item, startPercent: cumulative });
      return cumulative + item.percentage;
    }, 0);
    return result;
  }, [postTypeData]);

  return (
    <div className="post-type-breakdown">
      <h4 className="breakdown-title">Content Mix</h4>
      <div className="breakdown-content">
        <svg width="120" height="120" viewBox="0 0 120 120" className="donut-chart">
          {segments.map((item, index) => {
            const startAngle = (item.startPercent / 100) * 360 - 90;
            const endAngle = ((item.startPercent + item.percentage) / 100) * 360 - 90;
            
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const outerRadius = 50;
            const innerRadius = 35;
            
            const x1 = 60 + outerRadius * Math.cos(startRad);
            const y1 = 60 + outerRadius * Math.sin(startRad);
            const x2 = 60 + outerRadius * Math.cos(endRad);
            const y2 = 60 + outerRadius * Math.sin(endRad);
            const x3 = 60 + innerRadius * Math.cos(endRad);
            const y3 = 60 + innerRadius * Math.sin(endRad);
            const x4 = 60 + innerRadius * Math.cos(startRad);
            const y4 = 60 + innerRadius * Math.sin(startRad);
            
            const largeArc = item.percentage > 50 ? 1 : 0;
            
            return (
              <path
                key={index}
                d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`}
                fill={item.color}
                className="donut-segment"
              >
                <title>{item.type}: {item.percentage}%</title>
              </path>
            );
          })}
        </svg>
        <div className="breakdown-legend">
          {postTypeData.map((item, index) => (
            <div key={index} className="breakdown-legend-item">
              <div className="legend-color" style={{ background: item.color }}></div>
              <div className="legend-text">
                <span className="legend-type" style={{ color: item.color }}>{item.type}</span>
                <span className="legend-percent" style={{ color: item.color }}>{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostTypeBreakdown;
