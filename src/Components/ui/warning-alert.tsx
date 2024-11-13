import { AlertTriangle, X } from "lucide-react"
import { Button } from "./button"
import { FC } from "react"


interface props{
    message: string;
    onAction?: ()=>void;
    actionLabel?: string;
    onClose: ()=>void;
}

export const WarningAlert:FC<props> = ({actionLabel, message, onAction, onClose}) =>{

    return  (
        <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 shadow-md" role="alert">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-grow pr-8">
            <p className="text-yellow-700 dark:text-yellow-100">
              {message}{' '}
             {onAction && <Button 
                variant="link" 
                onClick={onAction}
                className="p-0 h-auto font-semibold text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200 underline"
              >
                {actionLabel ?? 'Action'}
              </Button>}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200 ml-auto"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    )
}