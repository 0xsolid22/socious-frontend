import React from 'react';
import { useNetwork } from 'wagmi';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { KING_OF_THE_FOOLS } from '../consts/goerli';
import useKingOfTheFools from '../hooks/useKingOfTheFools';
import DepositForm from './DepositForm';
import { ethers } from 'ethers';

const Notification = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SociousContainer() {
  const { chain } = useNetwork();
  const { king, lastDeposit } = useKingOfTheFools();

  if (chain?.id !== 5) {
    return null;
  }

  return (
    <Container>
      <Box>
        <Notification icon={false} severity="success" sx={{ fontSize: 16, mb: 2 }}>
          King Of The Fools Address:
          <Link
            sx={{ ml: 1 }}
            color="inherit"
            href={`https://goerli.etherscan.io/address/${KING_OF_THE_FOOLS}#code`}
            target="_blank"
            rel="noreferrer"
          >
            {KING_OF_THE_FOOLS}
          </Link>
          <Typography component="div" sx={{ mt: 2 }} textAlign="left">
            Current King: {king}
          </Typography>
          <Typography component="div" sx={{ mt: 2 }} textAlign="left">
            Last Deposit: {ethers.utils.formatEther(lastDeposit.toString())}
          </Typography>
        </Notification>
        <Box display="flex" sx={{ mb: 4 }}>
          <DepositForm />
        </Box>
      </Box>
    </Container>
  );
}
