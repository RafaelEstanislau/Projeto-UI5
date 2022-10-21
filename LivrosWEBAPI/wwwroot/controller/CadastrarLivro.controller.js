sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
], function (Controller,
	History,
	MessageBox,
	JSONModel) {
	"use strict";
	return Controller.extend("sap.ui.demo.walkthrough.controller.CadastrarLivro", {
		onInit: function () {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.attachRoutePatternMatched(this.coincidirRota, this);
			sap.ui.getCore().attachValidationError(function (oEvent) {

				oEvent.getParameter("element").setValueState(ValueState.Error);
	
			});
	
			sap.ui.getCore().attachValidationSuccess(function (oEvent) {
	
				oEvent.getParameter("element").setValueState(ValueState.None);
	
			});
		},
		coincidirRota: function (oEvent) {
			if (oEvent.getParameter("name") == "editarLivro") {
				var idAEditar = window.decodeURIComponent(oEvent.getParameter("arguments").id);
				this.carregarLivros(idAEditar)
			} else {
				this.getView().setModel(new sap.ui.model.json.JSONModel({}), "livro");
			}

		},
		carregarLivros: function (idAEditar) {
			var resultado = this.buscarLivro(idAEditar)
			resultado.then(livroRetornado => {
				var oModel = new JSONModel(livroRetornado);
				this.getView().setModel(oModel, "livro")
			})
		},
		buscarLivro: function (idAEditar) {
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
			var oModel = this.getView().getModel("livro").getData();
			let oRouter = this.getOwnerComponent().getRouter();
			

			if (!!oModel.id) {
					MessageBox.confirm("Deseja concluir a edição?", {
					title: "Confirmação",
					emphasizedAction: sap.m.MessageBox.Action.OK,
					actions: [sap.m.MessageBox.Action.OK,
						sap.m.MessageBox.Action.CANCEL
					],
					onClose: async function (oAction) {
						if (oAction === 'OK') {
							await fetch(`https://localhost:7012/livros/${oModel.id}`, {
								headers: {
									"Content-Type": "application/json; charset=utf-8"
								},
								method: 'PUT',
								body: JSON.stringify({
									id: oModel.id,
									autor: oModel.autor,
									titulo: oModel.titulo,
									editora: oModel.editora,
									lancamento: oModel.lancamento,
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
									autor: oModel.autor,
									titulo: oModel.titulo,
									editora: oModel.editora,
									lancamento: oModel.lancamento,
								})
							})
							oRouter.navTo("overview");
						}
					},
				})
			};
		},
	});
});