sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Core",
	"sap/ui/demo/walkthrough/controller/Validacao"

], function (Controller,
	History,
	MessageBox,
	JSONModel,
	Core,
	Validacao) {
	"use strict";
	return Controller.extend("sap.ui.demo.walkthrough.controller.CadastrarLivro" , {
		
		onInit: function () {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.attachRoutePatternMatched(this._coincidirRota, this);
			var tela = this.getView(),
				oMM = Core.getMessageManager();
			oMM.registerObject(tela.byId("input-titulo"), true)
			oMM.registerObject(tela.byId("input-editora"), true)
			oMM.registerObject(tela.byId("input-autor"), true)
			

			window.tela = tela;
		},
		_coincidirRota: function (oEvent) {
			if (oEvent.getParameter("name") == "editarLivro") {
				var idAEditar = window.decodeURIComponent(oEvent.getParameter("arguments").id);
				this._carregarLivros(idAEditar)
			} else {
				this.getView().setModel(new sap.ui.model.json.JSONModel({}), "livro");
			}
		},
		/*validarCampo: function (input) {
			var estado = "None";
			var erroDeValidacao = false;
			var oBinding = input.getBinding("value");


			let dataMinimaValida = new Date(1860, 1, 1).toISOString();
			let dataMaximaValida = new Date().toISOString();
			var dataInputada = this.getView().byId("DT").getValue();

			if(dataInputada.length == 0){
				estado = "Error"
				erroDeValidacao = true;
				
			}else{
				var dataInputadaFormatada = new Date(dataInputada).toISOString();
			}			
			try {
				oBinding.getType().validateValue(input.getValue());
				if(dataInputadaFormatada > dataMinimaValida && dataInputadaFormatada < dataMaximaValida){
					erroDeValidacao = false;
					estado = "None";
				}else{
					erroDeValidacao = true;
					estado = "Error";
				}
			} catch (oException) {
				estado = "Error";
				erroDeValidacao = true;
			}
			input.setValueState(estado);
			return erroDeValidacao;

		},*/

		_carregarLivros: function (idAEditar) {
			var resultado = this._buscarLivro(idAEditar)
			resultado.then(livroRetornado => {
				var oModel = new JSONModel(livroRetornado);
				this.getView().setModel(oModel, "livro")
			})
		},
		_buscarLivro: function (idAEditar) {
			var livroBuscado = fetch(`https://localhost:7012/livros/${idAEditar}`)
				.then((response) => response.json())
				.then(data => livroBuscado = data)
			return livroBuscado;

		},
		aoClicarEmBotaoVoltar: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("overview", {});
			}
		},

		aoClicarEmBotaoSalvar: function () {
			var livroASerSalvo = this.getView().getModel("livro").getData();
			let oRouter = this.getOwnerComponent().getRouter();
			
			//formatar o valor imputado para um valor de data
			
			let _validacao = new Validacao()
			
			var telaCadastro = this.getView(),
				inputs = [
					telaCadastro.byId("input-titulo"),
					telaCadastro.byId("input-editora"),
					telaCadastro.byId("input-autor"),
				
				],
				erroDeValidacao = false;


			inputs.forEach(function (input) {
				erroDeValidacao = _validacao.validarCampo(input) || erroDeValidacao;
			}, this);
			
			if (!erroDeValidacao) {
				if (!!livroASerSalvo.id) {
					MessageBox.confirm("Deseja concluir a edição?", {
						title: "Confirmação",
						emphasizedAction: sap.m.MessageBox.Action.OK,
						actions: [sap.m.MessageBox.Action.OK,
							sap.m.MessageBox.Action.CANCEL
						],
						onClose: async function (oAction) {
							if (oAction === 'OK') {
								await fetch(`https://localhost:7012/livros/${livroASerSalvo.id}`, {
									headers: {
										"Content-Type": "application/json; charset=utf-8"
									},
									method: 'PUT',
									body: JSON.stringify({
										id: livroASerSalvo.id,
										autor: livroASerSalvo.autor,
										titulo: livroASerSalvo.titulo,
										editora: livroASerSalvo.editora,
										lancamento: livroASerSalvo.lancamento,
									})
								})
								oRouter.navTo("overview");
							}
						},
					})

				} else {
					return MessageBox.confirm("Deseja concluir o cadastro?", {
						title: "Confirmação",
						emphasizedAction: sap.m.MessageBox.Action.OK,
						actions: [sap.m.MessageBox.Action.OK,
							sap.m.MessageBox.Action.CANCEL
						],
						onClose: async function (oAction) {
							if (oAction === 'OK') {
								await fetch('https://localhost:7012/livros', {
									headers: {
										"Content-Type": "application/json; charset=utf-8"
									},
									method: 'POST',
									body: JSON.stringify({
										autor: livroASerSalvo.autor,
										titulo: livroASerSalvo.titulo,
										editora: livroASerSalvo.editora,
										lancamento: livroASerSalvo.lancamento,
									})
								})
								oRouter.navTo("overview");
							}
						},
					})
				};
			} else {
				MessageBox.alert("Todos os campos devem ser preenchidos");
			}
		},
	});
});