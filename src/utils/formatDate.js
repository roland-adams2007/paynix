const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
export default formatDate;