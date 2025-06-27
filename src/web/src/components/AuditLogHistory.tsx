import { AuditLog, formatDate, translateField } from "@/models/auditlog.model";
import { formatMoney, formatBarCode } from "@/models/product.model";

interface Props {
  isSpecific: boolean;
  logs: AuditLog[];
}

function formatValue(value: unknown, field: string): string {
  field = field.toLowerCase();
  if (value === null || value === undefined) return "—";

  const num = Number(value);

  const isNumeric = !isNaN(num) && typeof value !== "boolean";

  if (field === "unitprice" && isNumeric) {
    return formatMoney(num);
  }
  if (field === "barcode" && typeof value === "string") {
    return formatBarCode(value);
  }

  if (field === "quantity" && isNumeric) {
    return num.toFixed(0);
  }

  if (isNumeric) {
    return num.toFixed(2);
  }

  return String(value);
}

const AuditLogHistory: React.FC<Props> = ({ isSpecific, logs }) => {
  const renderLogItem = (log: AuditLog, index: number) => {
    const userName = log.userId;
    const formattedDate = formatDate(new Date(log.timestamp));

    if (log.actionType === "Create") {
      return (
        <div key={log.id} className="bg-white p-4 rounded-md shadow-sm">
          <strong className="text-green-400">Adição</strong>
          {!isSpecific && (
            <div>
              <div>
                <strong>Tipo: </strong> {translateField(log.entityType)}
              </div>
              <div>
                <strong>Nome: </strong> {log.entityName}
              </div>
              <div>
                <strong>ID:</strong> {log.entityId}
              </div>
            </div>
          )}

          <div>
            <strong>Criado por:</strong> {userName}
          </div>
          <div>
            <strong>Data:</strong> {formattedDate}
          </div>
        </div>
      );
    }

    if (log.actionType === "Update") {
      return (
        <div key={log.id} className="bg-white p-4 rounded-md shadow-sm">
          <strong className="text-yellow-400">Atualização</strong>
          {!isSpecific && (
            <div>
              <div>
                <strong>Tipo: </strong> {translateField(log.entityType)}
              </div>
              <div>
                <strong>Nome: </strong> {log.entityName}
              </div>
              <div>
                <strong>ID:</strong> {log.entityId}
              </div>
            </div>
          )}
          <div>
            <strong>Alterado por:</strong> {userName}
          </div>
          <div>
            <strong>Data:</strong> {formattedDate}
          </div>
          <div>
            <strong>Campo:</strong> {translateField(log.property)}
          </div>
          <div>
            {log.property !== "Image" ? (
              <strong>
                {formatValue(log.oldValue, log.property)} →{" "}
                {formatValue(log.newValue, log.property)}
              </strong>
            ) : (
              ""
            )}
          </div>
        </div>
      );
    }

    if (log.actionType === "Delete") {
      return (
        <div key={log.id} className="bg-white p-4 rounded-md shadow-sm">
          <strong className="text-red-600">Exclusão</strong>
          {!isSpecific && (
            <div>
              <div>
                <strong>Tipo: </strong> {translateField(log.entityType)}
              </div>
              <div>
                <strong>Nome: </strong> {log.entityName}
              </div>
              <div>
                <strong>ID:</strong> {log.entityId}
              </div>
            </div>
          )}
          <div>
            <strong>Excluído por:</strong> {userName}
          </div>
          <div>
            <strong>Data:</strong> {formattedDate}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full">
      <h2 className="font-semibold text-xl mb-3">Histórico</h2>
      <div className="space-y-2">{logs.map(renderLogItem)}</div>
    </div>
  );
};

export default AuditLogHistory;
