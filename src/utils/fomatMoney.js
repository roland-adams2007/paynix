export default function formatMoney(amount) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN"
    }).format(amount);
}
