import { ReactElement, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type { ModalProps } from '@/types/ui-types';

export default function Modal({
  open = false,
  setOpen,
  title,
  content,
  onAgree,
  agreeButton = 'Agree',
  disagreeButton = 'Disagree',
}: ModalProps) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{disagreeButton}</Button>
        <Button onClick={onAgree} autoFocus>
          {agreeButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
