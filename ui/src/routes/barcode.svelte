<script>
  // @ts-nocheck
  import ModalConfirmation from "../../src/components/modal/modalConfirmation.svelte";
  import blockForbiddenChars from "../routes/presanitize";
  let imageLoader = "/images/axonLoader.gif";
  let barcodeReturn = "";
  let barcode = "";
  let urlS = `/api/v1/odf`;
  let urlBagde = `/api/v1/badge`;
  let supervisorApi = "api/v1/supervisorParada";
  let badge = "" || null;
  let showmodal = false;
  let showCorr = false;
  let returnedValueApi = `/api/v1/returnedValue`;
  let returnValueStorage;
  let superSuperMaqPar;
  let supervisor;
  let quantity;
  let superParada = false;
  let showBadge = true;
  let showBarcode = false;
  let showSupervisor = false;
  let quantityModal = "";
  let returnValueAvailable;
  let paradaMsg = "";
  let barcodeMsg = "";
  let showBreadcrumb = false;
  let loader = false;
  let modalMessage = "";

  let badgeMsg = "";
  if (window.location.href.includes("?")) {
    badgeMsg = window.location.href.split("?")[1].split("=")[1];
  }

  const checkPostSuper = async (event) => {
    if (superSuperMaqPar.length >= 6 && event.key === "Enter") {
      if (superSuperMaqPar === "000000") {
        modalMessage = "Crachá inválido";
      }
      loader = true
      superParada = false
      doPostSuper();
    }
  };

  const doPostSuper = async () => {
    console.log("linha 37", superSuperMaqPar);
    loader = true;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const res = await fetch(supervisorApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        superSuperMaqPar: !superSuperMaqPar ? "" : superSuperMaqPar,
      }),
    }).then((res) => res.json());
    console.log("linha 57 /barcode.svelte/", res);
    if (res.message === "maquina") {
      loader = false;
      window.location.href = "/#/codigobarras";
      location.reload();
    }
    if (res.message === "supervisor não encontrado") {
      modalMessage = "Supervisor não encontrado";
      superParada = false;
      //paradaMsg = "supervisor não encontrado";
      showmodal = false;
    }

    if (res.message === "erro na parada de maquina") {
      modalMessage = "Erro na parada de máquina";
      showmodal = false;
      superParada = false;
      //paradaMsg = "erro na parada de maquina";
    }
  };

  function verifyBarcodeBefore(event) {
    if (!barcode && barcode.length > 0) {
      return (modalMessage = "Algo deu errado");
    }

    if (event.key === "Enter" && barcode.length >= 16) {
      doPost();
    }
  }

  const doPost = async () => {
    if (!barcode) {
      return (modalMessage = "Algo deu errado");
    }

    if (barcode.length < 16) {
      return (modalMessage = "Algo deu errado");
    }

    loader = true;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const res = await fetch(urlS, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        barcode,
      }),
    }).then((res) => res.json());
    console.log("linha 89 res /barcode/", res);

    if (res.message === "Valores Reservados") {
      window.location.href = "/#/ferramenta";
      location.reload();
    }

    if (res.message === "Quantidade para reserva inválida") {
      modalMessage = "Quantidade para reserva inválida";
      loader = false;
    }

    if (res.message === "Não há item para reservar") {
      modalMessage = "Não há item para reservar";
      window.location.href = "/#/ferramenta";
      location.reload();
    }

    if (res.message === "Algo deu errado") {
      loader = false;
      modalMessage = "Algo deu errado";
    }

    // if (res.message === "codeApont 1 setup iniciado") {
    //   loader = false;
    //   window.location.href = "/#/ferramenta";
    // }

    // if (res.message === "codeApont 2 setup finalizado") {
    //   loader = false;
    //   window.location.href = "/#/ferramenta";
    // }

    // if (res.message === "codeApont 3 prod iniciado") {
    //   loader = false;
    //   window.location.href = "/#/codigobarras/apontamento";
    // }

    // if (res.message === "codeApont 4 prod finalzado") {
    //   window.location.href = "/#/rip";
    // }

    if (res.message === "codeApont 5 maquina parada") {
      loader = false;
      superParada = true;
    }

    if (res.message === "codigo de barras vazio") {
      modalMessage = "Código de barras vazio";
      //barcodeMsg = "codigo de barras vazio";
    }

    if (res.message === "odf não encontrada") {
      modalMessage = "ODF não encontrada";
      loader = false;
      //barcodeMsg = "odf não encontrada";
    }

    if (res.message === "não há limite na odf") {
      modalMessage = "Não há limite na ODF";
      loader = false;
    }
  };

  function checkBeforeBadge(event) {
    if (badge.length >= 6 && event.key === "Enter") {
      if (
        !badge ||
        badge === "000000" ||
        badge === "0" ||
        badge === "0" ||
        badge === "00" ||
        badge === "000" ||
        badge === "0000" ||
        badge === "00000"
      ) {
        modalMessage = "Crachá inválido";
      } else {
        checkBagde();
      }
    }
  }

  const checkBagde = async () => {
    loader = true;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const res = await fetch(urlBagde, {
      method: "POST",
      body: JSON.stringify({
        badge,
      }),
      headers,
    }).then((res) => res.json());
    loader = false;
    if (res.message === "Badge found") {
      showBarcode = true;
      showBadge = false;
      showBreadcrumb = true;
    }
    if (res.message === "Badge not found") {
      modalMessage = "Crachá não encontrado";
    }
    if (res.message === "Empty badge") {
      modalMessage = "Crachá vazio";
    }
    if (res.message === "Error on searching for badge") {
      modalMessage = "Erro ao localizar crachá";
    }
  };

  function closePop() {
    modalMessage = "";
    //document.getElementById("s").style.display = "none";
    window.location.href = "/#/codigobarras";
    location.reload();
  }

  function returnValue() {
    if (showmodal === false) {
      showmodal = true;
    } else {
      showmodal = false;
    }
  }
  async function doReturn() {
    loader = true;
    const res = await fetch(returnedValueApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        returnValueStorage: returnValueStorage,
        supervisor: supervisor,
        quantity: quantity,
        barcodeReturn: !barcodeReturn ? "" : barcodeReturn,
      }),
    }).then((res) => res.json());
    loader = false;
    console.log('linha 245 -return-', res);

    barcodeReturn = ''
    supervisor = ''
    quantity = ''
    returnValueStorage = ''
    showmodal = false;


    if(res.message === 'Refugo Inválido'){
      modalMessage = 'Não há refugo para estornar'
      showmodal = false;
    }

    if(res.message === 'Valor acima'){
      modalMessage = 'Valor apontado maior que o possível'
      showmodal = false;
    }

    if (res.message === "supervisor esta vazio") {
      modalMessage = "Campo supervisor está vazio";
      showSupervisor = true;
      showmodal = false;
      //location.reload();
    }
    if(res.message === 'Essa não pode ser estornada'){
      modalMessage = 'Essa não pode ser estornada'
      showmodal = false
    }

    if (res.message === "estorno feito") {
      modalMessage = "Estorno realizado";
      showmodal = false;
      //showCorr = true;
      //window.location.href = "/#/codigobarras";
      //location.reload();
    }
    if (res.message === "erro de estorno") {
      modalMessage === "Erro ao fazer estorno";
      //errorReturnValue = true;
      showmodal = false;
      //location.reload();
    }
    if (res.message === "quantidade esta vazio") {
      modalMessage = "Quantidade esta vazia";
      quantityModal = "quantidade esta vazio";
      showmodal = false;
      //location.reload();
    }
    if (res.message === "codigo de barras vazio") {
      modalMessage === "Código de barras está vazio";
      //barcodeMsg = "codigo de barras vazio";
      showmodal = false;
    }
    if (res.message === "odf não encontrada") {
      modalMessage === "ODF não encontrada";
      //barcodeMsg = "odf não encontrada";
      showmodal = false;
    }
    if (res.message === "não ha valor que possa ser devolvido") {
      modalMessage === "Não há valor a ser devolvido";
      //barcodeMsg = "não ha valor que possa ser devolvido";
      showmodal = false;
    }
    if (res.String === "valor devolvido maior que o permitido") {
      modalMessage === "Limite de estorno excedido";
      //barcodeMsg = "valor devolvido maior que o permitido";
      returnValueAvailable = res.qtdLibMax;
      showmodal = false;
    }
  }

  function closePopCor() {
    barcodeMsg = "";
    paradaMsg = "";
    showSupervisor = false;
    quantityModal = "";
    showCorr = false;
    showmodal = false;
    modalMessage = "";
    location.reload();
  }

  function goBack() {
    showBreadcrumb = false;
    showBarcode = false;
    showBadge = true;
    badge = "";
    barcode = "";
    modalMessage = "";
  }
  let back = "/images/icons8-go-back-24.png";
  export let title = "APONTAMENTO";
</script>

<main>
  {#if showBreadcrumb === true}
    <nav class="breadcrumb" aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="/#/codigobarras" on:click={goBack}>
            <img src={back} alt="" />Colaborador</a
          >
        </li>
      </ol>
    </nav>
  {/if}

  <div>
    <div>
      <!-- <Title /> -->
      <div class="titleDiv">
        <h1 class="title">{title}</h1>
      </div>

      {#if loader === true}
        <div class="imageLoader">
          <div class="loader">
            <img src={imageLoader} alt="" />
          </div>
        </div>
      {/if}

      {#if showBarcode === true}
        <div class="return">
          <button
            on:keypress={returnValue}
            on:click={returnValue}
            class="sideButton"
          >
            Estornar Valores
          </button>
        </div>
      {/if}
    </div>

    {#if superParada === true}
      <div class="modalBackground">
        <div class="confirmationModal">
          <h5>Maquina parada selecione um supervisor</h5>
          <input
            autofocus
            tabindex="12"
            id="supervisor"
            name="supervisor"
            type="text"
            on:input={blockForbiddenChars}
            on:keypress={checkPostSuper}
            onkeyup="this.value = this.value.toUpperCase()"
            bind:value={superSuperMaqPar}
          />
        </div>
      </div>
    {/if}

    {#if modalMessage === 'Não há refugo para estornar'}
      <ModalConfirmation title={modalMessage} on:message={closePopCor} />
    {/if}

    {#if modalMessage === "Essa não pode ser estornada"}
      <ModalConfirmation title={modalMessage} on:message={closePopCor} />
    {/if}

    {#if modalMessage === "Estorno realizado"}
      <ModalConfirmation title={modalMessage} on:message={closePopCor} />
    {/if}

    {#if modalMessage === "Quantidade para reserva inválida"}
      <ModalConfirmation on:message={closePopCor} title={modalMessage} />
    {/if}

    {#if modalMessage === "Erro ao fazer estorno"}
      <ModalConfirmation on:message={closePopCor} title={modalMessage} />
    {/if}

    {#if modalMessage === "Não há valor a ser devolvido"}
      <ModalConfirmation on:message={closePopCor} title={modalMessage} />
    {/if}

    {#if modalMessage === "Supervisor não encontrado"}
      <ModalConfirmation on:message={closePopCor} title={modalMessage} />
    {/if}

    {#if modalMessage === "Limite de estorno excedido"}
      <ModalConfirmation on:message={closePopCor} title={modalMessage} />
    {/if}

    {#if modalMessage === "Não há limite na ODF"}
      <ModalConfirmation on:message={closePop} title={modalMessage} />
    {/if}

    {#if modalMessage === "ODF não encontrada"}
      <ModalConfirmation on:message={closePop} title={modalMessage} />
    {/if}

    {#if modalMessage === "Código de barras está vazio"}
      <ModalConfirmation on:message={closePop} title={modalMessage} />
    {/if}

    {#if modalMessage === "Crachá não encontrado"}
      <ModalConfirmation on:message={closePop} title={modalMessage} />
    {/if}

    {#if modalMessage === "Crachá vazio"}
      // bagdeEmpty === true
      <ModalConfirmation on:message={closePop} title={modalMessage} />
    {/if}

    {#if modalMessage === "Quantidade está vazia"}
      <ModalConfirmation on:message={closePop} title={modalMessage} />
    {/if}

    {#if modalMessage === "Campo supervisor está vazio"}
      <ModalConfirmation on:message={closePop} title={modalMessage} />
    {/if}

    {#if modalMessage === "Crachá inválido"}
      <ModalConfirmation on:message={closePopCor} title={modalMessage} />
    {/if}

    {#if modalMessage === "Algo deu errado"}
      <ModalConfirmation on:message={closePopCor} title={modalMessage} />
    {/if}

    {#if showBarcode === true}
      <div class="form">
        <div id="popUpCracha">
          <div id="title">CÓDIGO DE BARRAS DA ODF</div>
          <input
            autocomplete="off"
            autofocus
            on:keypress={verifyBarcodeBefore}
            on:input|preventDefault={blockForbiddenChars}
            bind:value={barcode}
            onkeyup="this.value = this.value.toUpperCase()"
            name="MATRIC"
            id="MATRIC"
            type="text"
          />
        </div>
      </div>
    {/if}

    {#if showBadge === true}
      <div class="form">
        <div id="popUpCracha">
          <div id="title">COLABORADOR</div>
          <input
            autocomplete="off"
            autofocus
            on:keypress={checkBeforeBadge}
            on:input|preventDefault={blockForbiddenChars}
            bind:value={badge}
            onkeyup="this.value = this.value.toUpperCase()"
            name="MATRIC"
            id="MATRIC"
            type="text"
          />
        </div>
      </div>
    {/if}
  </div>
  {#if showmodal === true}
    <div class="fundo">
      <div class="header">
        <div class="close">
          <h4>Codigo do Supervisor</h4>
        </div>
        <input
          autocomplete="off"
          autofocus
          tabindex="14"
          bind:value={supervisor}
          class="returnInput"
          on:input={blockForbiddenChars}
          onkeyup="this.value = this.value.toUpperCase()"
          type="text"
          name="supervisor"
          id="supervisor"
        />
        <h4>Qual irá retornar</h4>
        <div class="options">
          <select
            tabindex="15"
            bind:value={returnValueStorage}
            name="id"
            id="id"
          >
            <option>BOAS</option>
            <option>RUINS</option>
          </select>
        </div>
        <h4>Insira a quantidade que deseja estornar</h4>
        <input
          tabindex="15"
          on:input={blockForbiddenChars}
          autocomplete="off"
          class="returnInput"
          onkeyup="this.value = this.value.toUpperCase()"
          bind:value={quantity}
          type="text"
          name="returnValueStorage"
        />

        <h4>CÓDIGO DE BARRAS DA ODF</h4>
        <input
          tabindex="16"
          on:input={blockForbiddenChars}
          autocomplete="off"
          class="returnInput"
          onkeyup="this.value = this.value.toUpperCase()"
          bind:value={barcodeReturn}
          id="barcode"
          name="barcode"
          type="text"
        />

        <div>
          <p
            tabindex="17"
            on:keypress|preventDefault={doReturn}
            on:click|preventDefault={doReturn}
          >
            Confirmar
          </p>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  .header {
    margin: 0%;
    padding: 0%;
    color: white;
    background-color: black;
    width: 700px;
    height: 350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 10px;
    z-index: 9;
  }
  a {
    color: #252525;
    font-size: 20px;
  }

  a:hover {
    opacity: 0.5s;
    transition: all 1s;
  }
  .modalBackground {
    transition: 1s;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(17, 17, 17, 0.618);
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    z-index: 999999999999999999999999999999;
  }
  .breadcrumb {
    margin-top: 5px;
    margin-left: 0%;
    margin-bottom: 0%;
    text-decoration: underline;
  }
  .loader {
    margin: 0%;
    position: relative;
    width: 10vw;
    height: 5vw;
    padding: 1.5vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .imageLoader {
    margin: 0%;
    padding: 0%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: black;
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button {
    letter-spacing: 0.5px;
    width: fit-content;
    height: 28px;
    border: none;
    color: white;
    background-color: transparent;
  }
  /* .loader {
    margin: 0%;
    position: relative;
    width: 10vw;
    height: 5vw;
    padding: 1.5vw;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999999999;
  } */
  .imageLoader {
    margin: 0%;
    padding: 0%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: black;
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999999999;
  }
  div {
    margin: 0%;
    padding: 0%;
  }
  input {
    margin: 1%;
    padding: 0%;
    border-radius: 3px;
  }
  h4 {
    width: 400px;
    margin: 0%;
    padding: 0%;
  }
  .close {
    margin: 0%;
    padding: 0%;
    width: 400px;
    display: flex;
  }
  select {
    margin: 1%;
    padding: 0%;
    width: 150px;
    border-radius: 3px;
    color: #fff;
    background-color: #252525;
  }
  .returnInput {
    height: 30px;
    width: 100px;
  }
  p {
    margin: 0%;
    padding: 0%;
    display: flex;
    justify-content: center;
    text-decoration: none;
    background: #252525;
    color: #fff;
  }
  .form {
    height: 180px;
    letter-spacing: 1px;
    border-color: grey;
    box-shadow: 0 0 10px 0.5px rgba(0, 0, 0, 0.4);
  }
  .fundo {
    margin: 0%;
    padding: 0%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(17, 17, 17, 0.618);
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    z-index: 8;
  }

  .return {
    display: flex;
    justify-content: flex-end;
    text-align: center;
    align-items: center;
    color: black;
    background-color: transparent;
  }

  .sideButton {
    color: black;
    margin: 1%;
    padding: 0%;
    font-size: 14px;
    width: 132px;
    height: 35px;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    border-radius: 3px;
    background-color: transparent;
    letter-spacing: 1px;
    /* border-color: grey;
    box-shadow: 0 0 10px 0.5px rgba(0, 0, 0, 0.4); */
  }

  .sideButton:hover {
    cursor: pointer;
    background-color: black;
    color: white;
    transition: 1s;
  }

  #MATRIC {
    margin: 1%;
  }

  h5 {
    font-size: 45px;
  }

  main {
    margin: 1%;
  }

  #popUpCracha {
    margin: 1%;
    padding: 0%;
    padding: 15px;
    height: 180px;
    font-size: 35px;
    border-radius: 5px;
    color: black;
    justify-content: center;
    text-align: center;
    align-items: center;
  }
  input {
    border-radius: 8px;
  }

  .confirmationModal {
    transition: all 1s;
    animation: ease-in;
    margin: 0%;
    padding: 0%;
    color: white;
    background-color: #252525;
    top: 0;
    left: 0;
    width: 600px;
    height: 250px;
    display: block;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 8px;
  }
  
</style>
