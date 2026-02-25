"use client";

interface TopBarLoaderProps {
    isLoading: boolean;
    color?: string; // Optional: change color on the fly
}

export default function TopBarLoader({ isLoading,  color = "bg-success" }: TopBarLoaderProps) {

    if (!isLoading) return null;

    return (
        <div
            className="progress fixed-top"
            style={{
                height: "3px",
                zIndex: 9999,
                borderRadius: 0
            }}
        >
            <div
                className="progress-bar progress-bar-animated"
                role="progressbar"
                style={{
                    width: "100%",
                    backgroundColor: "blue"
                }}
            />
        </div>
    );
}
