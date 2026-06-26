import { useEffect } from 'react';
import { useSkillStore } from '../store/skillStore';

export function useSkillData() {
  const hydrate = useSkillStore((state) => state.hydrate);
  const dashboardReady = useSkillStore((state) => state.dashboardReady);

  useEffect(() => {
    if (!dashboardReady) {
      hydrate();
    }
  }, [dashboardReady, hydrate]);
}

