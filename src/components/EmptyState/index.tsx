import React from "react";

type EmptyStateProps = {
  onClickHere: (event: React.MouseEvent<HTMLSpanElement>) => void;
};

const EmptyState: React.FC<EmptyStateProps> = ({ onClickHere }) => {
  return (
    <div className="empty-state">
      <div>
        <p>Nothing to see yet.</p>
        <p>
          <span className="text-primary" onClick={onClickHere}>
            Click here
          </span>{" "}
          to add your first beer.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
