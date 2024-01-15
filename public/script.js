// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();


  // Calculate GST
  let taxe=false;
        let btn =document.querySelector('#switch');
        let btn1 =document.querySelector('.displaye');
        let taxes=document.querySelectorAll('.card1 span');
        let original=[];
        for(let tax of taxes){
            original.push(tax.innerText);
        }

        let changePrice =()=>{
          if(taxe==false){
              taxe=true;
              let i=0;
          for(let tax of taxes){

                  afterTax=(original[i]*18)/100;
                  let money=(+original[i])+(+afterTax);
                  tax.innerText=` ${money}`;
                  i++;
          }
          }
          else{
              taxe=false
              let i=0;
              for(let tax of taxes){
                  tax.innerText=`${original[i]}`;
                  i++
              }
          }
      };
      btn.addEventListener("click",changePrice);

      btn1.addEventListener("click",changePrice);
      console.log(btn1);