const REPORT_RERENDER = true;

export const MemoReporter = REPORT_RERENDER
  ? <P extends Record<string, unknown>>(name: string) =>
      (previousProperties: P, nextProperties: P) => {
        const changedFields = Object.keys(previousProperties)
          .filter((key) => previousProperties[key] !== nextProperties[key])
          .map((key) => ({
            key,
            old: previousProperties[key],
            new: nextProperties[key],
          }));

        if (changedFields.length) {
          console.log(name, changedFields);
          return false;
        }

        return true;
      }
  : () => undefined; // Use the default prop comparison from React.memo
