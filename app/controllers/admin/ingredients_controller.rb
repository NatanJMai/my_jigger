class Admin::IngredientsController < ApplicationController
  load_and_authorize_resource
  load_and_authorize_resource :organization
  decorates_assigned :ingredient

  def find
    ingredient = Ingredient.find_by(id: params[:id])
    if ingredient
      render json: {
        id: ingredient.id,
        name: ingredient.name,
        unit: ingredient.unit,
        volume: ingredient.volume,
        cost_cents: ingredient.cost&.to_f
      }, status: :ok
    else
      render json: { error: 'Ingredient not found' }, status: :not_found
    end
  end

  def details
    @ingredient = Ingredient.find_by(id: params[:id])&.decorate
    respond_to(&:js)
  end

  def calculate
    volume = params[:volume].to_f
    quantity = params[:quantity].to_f
    cost_cents = params[:cost_cents].to_f

    calculated_price = Ingredient.calculated_price(volume, quantity, cost_cents)

    render json: {
      calculated_price: "R$#{calculated_price.round(2)}"
    }, status: :ok
  end

  private

  def ingredient_params
    params.require(:ingredient).permit(:name, :cost_cents, :item_id, :quantity)
  end
end
