import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  Checkbox as MuiCheckbox,
  CheckboxProps,
  SxProps,
  Theme,
  Typography,
  TypographyProps,
} from '@mui/material';
import { clsx } from 'clsx';
import React, { forwardRef, memo } from 'react';

import styles from './styles.module.scss';

const ICON_SX: SxProps<Theme> = { color: 'var(--gray-2-color)' };

interface Props extends Omit<CheckboxProps, 'onChange'> {
  containerClassName?: string;
  label?: string;
  labelProps?: TypographyProps;
  onChange?: (checked: boolean) => void;
}

const Component: React.FC<Props> = forwardRef(
  ({ containerClassName, label, labelProps, sx = [], checked, onChange, ...props }, ref) => {
    const handleChange = () => {
      onChange?.(!checked);
    };

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div
        className={clsx(styles.checkbox, containerClassName)}
        role="button"
        tabIndex={-1}
        onClick={handleChange}
      >
        <MuiCheckbox
          checked={checked}
          checkedIcon={<CheckBoxIcon sx={ICON_SX} />}
          icon={<CheckBoxOutlineBlankIcon sx={ICON_SX} />}
          ref={ref}
          sx={[{ padding: '0px' }, ...(Array.isArray(sx) ? sx : [sx])]}
          {...props}
        />
        {label && (
          <Typography color="var(--gray-2-color)" ml="8px" variant="subtitle2" {...labelProps}>
            {label}
          </Typography>
        )}
      </div>
    );
  },
);

export const Checkbox = memo(Component);
