import AddIcon from '@mui/icons-material/Add';
import { Button, SxProps, Tab, Tabs, Theme, Typography } from '@mui/material';
import { SearchInput } from 'components/SearchInput';
import { ROUTES } from 'constants/routes';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { DealsInProgress } from './components/DealsInProgress';
import { DecisionsMade } from './components/DecisionsMade';
import { DraftDeals } from './components/DraftDeals';
import styles from './styles.module.scss';

type TTab = 'draft-deals' | 'deals-in-progress' | 'decisions-made';

const TABS: TTab[] = ['draft-deals', 'deals-in-progress', 'decisions-made'];
const SEARCH_INPUT_SX: SxProps<Theme> = { mr: '12px', width: '344px' };

export const CompaniesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') as TTab | null;
  const [activeTabIndex, setActiveTabIndex] = useState<number | false>(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const tabIndex = TABS.findIndex(tab => tab === activeTab);

    if (tabIndex === -1) {
      setActiveTabIndex(0);
    } else {
      setActiveTabIndex(tabIndex);
    }
  }, [activeTab]);

  const handleActiveTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue);

    setSearchParams({ tab: TABS[newValue] });
  };

  const handleAddNewDeal = () => {
    navigate(ROUTES.PITCHBOOK);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__heading}>
        <Typography color="var(--text-3-color)" variant="h4">
          Companies
        </Typography>
        <div className={styles['container__right-column']}>
          <SearchInput
            placeholder="Search here..."
            sx={SEARCH_INPUT_SX}
            onChange={setSearchValue}
          />
          <Button
            classes={{ startIcon: styles['container__new-button-icon'] }}
            color="secondary"
            size="small"
            startIcon={
              <AddIcon
                sx={{
                  width: '24px',
                  height: '24px',
                  color: 'var(--main-1-color)',
                }}
              />
            }
            sx={{ width: '112px', paddingLeft: '6px', paddingRight: '6px' }}
            variant="contained"
            onClick={handleAddNewDeal}
          >
            New Deal
          </Button>
        </div>
      </div>
      <Tabs
        indicatorColor="primary"
        sx={{ paddingLeft: '44px', marginBottom: '12px' }}
        value={activeTabIndex}
        onChange={handleActiveTabChange}
      >
        <Tab label="Draft Deals" />
        <Tab label="Deals in Progress" />
        <Tab label="Decisions Made" />
      </Tabs>
      {activeTabIndex === 0 && <DraftDeals searchValue={searchValue.trim()} />}
      {activeTabIndex === 1 && <DealsInProgress searchValue={searchValue.trim()} />}
      {activeTabIndex === 2 && <DecisionsMade searchValue={searchValue.trim()} />}
    </div>
  );
};
