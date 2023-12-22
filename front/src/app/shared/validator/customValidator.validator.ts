import { AbstractControl, ValidatorFn } from "@angular/forms";



//Validation des dates de mandat
export function dateValidation(dateDebut : string , dateFin : string) : boolean {
  if(new Date(dateDebut).getTime() > new Date(dateFin).getTime()) {
    return false ;
  }else{
    return true ;
  }
}

export function datComp (): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    if(formGroup.get('date_debut_mandat')?.value !=="" &&  formGroup.get("date_fin_mandat")?.value !== ""){
      const date_debut_control = formGroup.get('date_debut_mandat')?.value;
      const date_fin_control = formGroup.get("date_fin_mandat")?.value;
      if (!date_debut_control || !date_fin_control) {
        return null;
      }

      if (
        formGroup.get("date_fin_mandat")?.errors &&
        !formGroup.get("date_fin_mandat")?.errors?.['invalidDate']
      ) {
        return null;
      }

      if (!dateValidation(date_debut_control , date_fin_control)) {

        formGroup.get("date_fin_mandat")?.setErrors({ invalidDate: true });
        return { invalidDate: true };
      } else {
        formGroup.get("date_fin_mandat")?.setErrors(null);
        return null;
      }
    }
    return null ;

  }
};


