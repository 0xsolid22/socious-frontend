import { useState } from 'react';
import { ethers } from 'ethers';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';

import { KING_OF_THE_FOOLS } from '../consts/goerli';
import kingOfTheFoolsABI from '../utils/kingOfTheFoolsABI.json';

type Inputs = {
  amount: number;
};

type ErrorWithReason = {
  reason: string;
};

const schema = yup
  .object({
    amount: yup.number().positive().required(),
  })
  .required();

export default function DepositForm() {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      amount: 0,
    },
  });
  const [open, setOpen] = useState(false);

  const watchedAmount = Number(watch('amount', 0));
  const amount = isNaN(watchedAmount) ? 0 : watchedAmount;

  const { config, error, isFetching, isError } = usePrepareContractWrite({
    address: KING_OF_THE_FOOLS,
    abi: kingOfTheFoolsABI,
    functionName: 'deposit',
    overrides: {
      value: ethers.utils.parseEther(Math.max(0, amount).toString()),
    },
  });

  const { write } = useContractWrite(config);

  const onSubmit: SubmitHandler<Inputs> = async () => {
    if (write) {
      write();
    }
    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="success" sx={{ mr: 4 }} onClick={handleClickOpen}>
        Deposit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ minWidth: '350px' }}>Deposit ETH</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter ETH amount.</DialogContentText>

            <TextField
              autoFocus
              margin="dense"
              id="amount"
              label="Amount"
              fullWidth
              variant="standard"
              {...register('amount')}
            />
            {errors.amount && (
              <Typography color="red" role="alert">
                Amount should be positive number
              </Typography>
            )}
            {!errors.amount && error && (
              <Typography color="red" role="alert">
                {(error as unknown as ErrorWithReason)['reason']}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button disabled={isFetching || isError} type="submit">
              Deposit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
