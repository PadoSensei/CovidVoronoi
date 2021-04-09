export const Tooltip = ({activeRow, formatComma, formatDate, className}) => {
  return (
    <text
      className={className}
      x={-10}
      y={-10}
      text-anchor={'end'}
    >
      {activeRow.countryName}:{' '}
      {formatComma(activeRow.deathTotal)}{' '}
      {activeRow.deathTotal > 1 ? 'deaths' : 'death'} as of{' '}
      {formatDate(activeRow.date)}
    </text>
  );
};
