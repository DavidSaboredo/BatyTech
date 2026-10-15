import { formatMoney } from "@/lib/money";
import { installmentAmount, shippingCostFor, storeTerms, transferPrice } from "@/lib/store-terms";

function Dot() {
  return <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />;
}

/** Condiciones de compra bajo el precio: transferencia, cuotas, envío y garantía (valores en lib/store-terms). */
export function SaleTerms({ price }: { price: number }) {
  const { transferDiscountPercent, installments, shippingCost, freeShippingFrom, warrantyMonths } = storeTerms;
  const freeShipping = shippingCostFor(price) === 0;

  return (
    <ul
      aria-label="Condiciones de compra"
      className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-zinc-950/85 p-4 text-sm leading-5 text-zinc-300"
    >
      {transferDiscountPercent > 0 ? (
        <li className="flex items-start gap-2.5">
          <Dot />
          <span>
            <strong className="font-semibold text-white">{formatMoney(transferPrice(price))}</strong> pagando por
            transferencia ({transferDiscountPercent}% de descuento)
          </span>
        </li>
      ) : null}
      {installments > 1 ? (
        <li className="flex items-start gap-2.5">
          <Dot />
          <span>
            Hasta <strong className="font-semibold text-white">{installments} cuotas sin interés</strong> de{" "}
            {formatMoney(installmentAmount(price))}
          </span>
        </li>
      ) : null}
      <li className="flex items-start gap-2.5">
        <Dot />
        <span>
          {freeShipping ? (
            <>
              <strong className="font-semibold text-white">Envío gratis</strong> a todo el país
            </>
          ) : (
            <>
              Envío a todo el país: <strong className="font-semibold text-white">{formatMoney(shippingCost)}</strong>
              {freeShippingFrom > 0 ? ` (gratis desde ${formatMoney(freeShippingFrom)})` : null}
            </>
          )}{" "}
          o retiro sin cargo
        </span>
      </li>
      <li className="flex items-start gap-2.5">
        <Dot />
        <span>
          <strong className="font-semibold text-white">{warrantyMonths} meses de garantía</strong>
        </span>
      </li>
    </ul>
  );
}
