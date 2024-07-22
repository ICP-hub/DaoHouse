import React from 'react'
import Container from '../Container/Container'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
const MuiSkeleton = () => {
    return (
        <Container >
            <div className="flex flex-col sm:flex-row gap-10 sm:gap-20 md:gap-36 lg:gap-56">
                <Stack spacing={1}>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="rectangular" width={210} height={60} />
                    <Skeleton variant="rounded" width={210} height={60} />
                </Stack>
                <Stack spacing={1}>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="rectangular" width={210} height={60} />
                    <Skeleton variant="rounded" width={210} height={60} />
                </Stack>
            </div>
            <div className="hidden sm:flex gap-10 sm:gap-20 md:gap-36 lg:gap-56 mt-10">
                <Stack spacing={1}>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="rectangular" width={210} height={60} />
                    <Skeleton variant="rounded" width={210} height={60} />
                </Stack>
                <Stack spacing={1}>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="rectangular" width={210} height={60} />
                    <Skeleton variant="rounded" width={210} height={60} />
                </Stack>
            </div>
        </Container>
    )
}

export default MuiSkeleton