sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("sap.ui.demo.walkthrough.controller.ListaDeLivros", {
		
		onInit : function () {
            this.carregarLivros();
		},

        carregarLivros: function(){
			var resultado = this.buscarLivros();
			resultado.then(lista=> {
				var oModel = new JSONModel(lista);
				this.getView().setModel(oModel, "listaDeLivros")
			})
		},

        buscarLivros: function(){
            var livrosObtidos = fetch("https://localhost:7012/livros")
                .then((response) => response.json())
                .then(data => livrosObtidos = data);
                return livrosObtidos;
        },

		aoClicarEmLivro: function (oEvent) {
			var oItem = oEvent.getSource();
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("detail", {
				id: window.encodeURIComponent(oItem.getBindingContext("listaDeLivros").getProperty('id'))
			});
		},
		
		aoProcurar : function (oEvent) {
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("titulo", FilterOperator.Contains, sQuery));
			}
			var oList = this.byId("ListaDeLivros");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		}
	});
});