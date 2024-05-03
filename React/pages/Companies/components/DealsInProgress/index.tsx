import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Typography } from '@mui/material';
import { ConfirmModal } from 'components/ConfirmModal';
import { EmptyData } from 'components/EmptyData';
import { Pagination } from 'components/Pagination';
import { ROUTES } from 'constants/routes';
import { format } from 'date-fns';
import { useSnackbar } from 'hooks/useSnackbar';
import { useUpdateEffect } from 'hooks/useUpdateEffect';
import { StatusChangeMenu } from 'pages/Companies/components/StatusChangeMenu';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import {
  useGetInProgressCompaniesQuery,
  useUpdateCompanyStatusMutation,
} from 'services/rtkQuery/company';
import { CompanyStatus } from 'types/models';
import { getCurrentPageInfo, getTotalPagesCount } from 'utils/pagination';

import styles from './styles.module.scss';

const FETCH_LIMIT = 10;

interface Props {
  searchValue: string;
}

export const DealsInProgress: React.FC<Props> = ({ searchValue }) => {
  const navigate = useNavigate();
  const { handleApiError, snackbar } = useSnackbar();
  const [moreAnchorEl, setMoreAnchorEl] = React.useState<HTMLElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateStatusConfirmModalVisible, setUpdateStatusConfirmModalVisible] = useState(false);
  const getInProgressCompaniesQuery = useGetInProgressCompaniesQuery({
    pageNum: currentPage,
    perPage: FETCH_LIMIT,
    name: searchValue.length >= 3 ? searchValue : undefined,
  });
  const activeCompanyId = useRef<number | null>(null);
  const selectedNewStatus = useRef<CompanyStatus | null>(null);
  const [updateCompanyStatusMutation, { isLoading: isLoadingUpdateCompanyStatusMutation }] =
    useUpdateCompanyStatusMutation();

  useUpdateEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const handleCompanyClick = (id: number) => {
    navigate(generatePath(ROUTES.COMPANY, { id: id.toString() }));
  };

  const showMoreMenu = (event: React.MouseEvent<HTMLButtonElement>, companyId: number) => {
    event.stopPropagation();

    activeCompanyId.current = companyId;
    setMoreAnchorEl(event.currentTarget);
  };

  const hideMoreMenu = (event: React.MouseEvent<HTMLButtonElement | HTMLLIElement>) => {
    event.stopPropagation();

    setMoreAnchorEl(null);
  };

  const showUpdateStatusConfirmModal = useCallback(() => {
    setUpdateStatusConfirmModalVisible(true);
  }, []);

  const hideUpdateStatusConfirmModal = useCallback(() => {
    setUpdateStatusConfirmModalVisible(false);
  }, []);

  const handleStatusSelect = (status: CompanyStatus) => {
    selectedNewStatus.current = status;

    showUpdateStatusConfirmModal();
  };

  const handleUpdateStatusConfirm = useCallback(async () => {
    try {
      if (activeCompanyId.current && selectedNewStatus.current) {
        hideUpdateStatusConfirmModal();

        await updateCompanyStatusMutation({
          status: selectedNewStatus.current,
          id: activeCompanyId.current,
        }).unwrap();
      }
    } catch (e) {
      handleApiError(e);
    }
  }, [handleApiError, hideUpdateStatusConfirmModal, updateCompanyStatusMutation]);

  const totalPages = useMemo(() => {
    return getTotalPagesCount({
      totalItemsCount: getInProgressCompaniesQuery.currentData?.total || 0,
      fetchLimit: FETCH_LIMIT,
    });
  }, [getInProgressCompaniesQuery.currentData?.total]);

  if (
    getInProgressCompaniesQuery.isFetching ||
    getInProgressCompaniesQuery.currentData?.results.length === 0
  ) {
    return (
      <EmptyData
        description="No companies available"
        loading={getInProgressCompaniesQuery.isFetching}
        title="In Progress"
      />
    );
  }

  return (
    <div className={styles.container}>
      <table className={styles.container__table}>
        <thead>
          <tr>
            <th>
              <Typography
                color="var(--black-color)"
                fontWeight="300"
                lineHeight="16px"
                variant="body1"
              >
                Company Name
              </Typography>
            </th>
            <th>
              <Typography
                color="var(--black-color)"
                fontWeight="300"
                lineHeight="16px"
                variant="body1"
              >
                Decision Threshold
              </Typography>
            </th>
            <th>
              <Typography
                color="var(--black-color)"
                fontWeight="300"
                lineHeight="16px"
                variant="body1"
              >
                Total Score
              </Typography>
            </th>
            <th>
              <Typography
                color="var(--black-color)"
                fontWeight="300"
                lineHeight="16px"
                variant="body1"
              >
                Responsible
              </Typography>
            </th>
            <th>
              <Typography
                color="var(--black-color)"
                fontWeight="300"
                lineHeight="16px"
                variant="body1"
              >
                Updated
              </Typography>
            </th>
            <th>
              <Typography
                color="var(--black-color)"
                fontWeight="300"
                lineHeight="16px"
                variant="body1"
              >
                Status
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {getInProgressCompaniesQuery.currentData?.results.map(company => (
            <tr key={company.id} onClick={() => handleCompanyClick(company.id)}>
              <td>
                <Typography color="text.primary" fontWeight="700" lineHeight="16px" variant="body1">
                  {company.name}
                </Typography>
              </td>
              <td>
                <Typography color="text.primary" fontWeight="700" lineHeight="16px" variant="body1">
                  {company.decision_threshold}%
                </Typography>
              </td>
              <td>
                <Typography
                  color={company.total_score > 50 ? 'var(--success-color)' : 'var(--error-color)'}
                  fontWeight="700"
                  lineHeight="16px"
                  variant="body1"
                >
                  {company.total_score}%
                </Typography>
              </td>
              <td>
                <Typography color="text.primary" fontWeight="700" lineHeight="16px" variant="body1">
                  {company.user.fist_name} {company.user.last_name}
                </Typography>
              </td>
              <td>
                <Typography color="text.primary" fontWeight="700" lineHeight="16px" variant="body1">
                  {format(new Date(company.updated_at), 'MMM dd, yyyy')}
                </Typography>
              </td>
              <td>
                <div>
                  <div>
                    <Typography
                      color="var(--success-color)"
                      fontWeight="700"
                      lineHeight="16px"
                      variant="body1"
                    >
                      In Progress
                    </Typography>
                  </div>
                  <button
                    aria-label="More"
                    disabled={isLoadingUpdateCompanyStatusMutation}
                    title="More"
                    type="button"
                    onClick={event => showMoreMenu(event, company.id)}
                  >
                    <MoreVertIcon
                      sx={{
                        color: 'var(--gray-6-color)',
                        '&:hover': { color: 'var(--gray-2-color)' },
                      }}
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.container__footer}>
        <Typography color="var(--gray-2-color)" lineHeight="14px" variant="subtitle2">
          {getCurrentPageInfo({
            currentPage,
            fetchLimit: FETCH_LIMIT,
            currentPageItemsCount: getInProgressCompaniesQuery.currentData?.results.length || 0,
            totalItemsCount: getInProgressCompaniesQuery.currentData?.total || 0,
          })}
        </Typography>
        <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
      </div>
      <StatusChangeMenu
        anchorEl={moreAnchorEl}
        statuses={['draft', 'closed', 'rejected']}
        onClose={hideMoreMenu}
        onSelect={handleStatusSelect}
      />
      <ConfirmModal
        description="Are you sure you want to update this company status?"
        open={updateStatusConfirmModalVisible}
        title="Do you want to update the status?"
        onCancel={hideUpdateStatusConfirmModal}
        onConfirm={handleUpdateStatusConfirm}
      />
      {snackbar}
    </div>
  );
};
