import { CircularProgress } from "@mui/joy";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-around">
            <CircularProgress
                variant="soft"
                size="lg"
                thickness={4}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                }}
            />
        </div>
    );
}