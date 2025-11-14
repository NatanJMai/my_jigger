class Admin::IngredientsController < ApplicationController
  load_and_authorize_resource
  load_and_authorize_resource :organization
  load_and_authorize_resource :ingredient, through: :organization
  decorates_assigned :organization
  decorates_assigned :ingredient
  decorates_assigned :ingredients

  def index
    # 1. Load all ingredients for the table list
    @ingredients = @organization.ingredients.order(:name)
  end

  # The 'new' action is no longer strictly needed if the form is in the index view,
  # but we can keep it standard for other uses.
  def new
    @ingredient = @organization.ingredients.new

    respond_to do |format|
      format.js
      format.html
    end
  end

  def edit
    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end

  # POST /menus or /menus.json
  def create
    @ingredient = @organization.ingredients.build(ingredient_params)

    if @ingredient.save
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to admin_organization_ingredients_path(@organization) }
      end
    else
      respond_to do |format|
        format.turbo_stream { render :edit, status: :unprocessable_entity }
        format.html { render :new, status: :unprocessable_entity }
      end
    end
  end


  def update
    if @ingredient.update(ingredient_params)
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to admin_organization_ingredients_path(@organization) }
      end
    else
      respond_to do |format|
        format.turbo_stream { render :edit, status: :unprocessable_entity }
        format.html { render :edit, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @organization = @ingredient.organization
    @ingredient.destroy

    respond_to do |format|
      format.html { redirect_to admin_organization_ingredients_path(@organization), notice: 'Ingredient was successfully destroyed.' }
      format.json { head :no_content }
      format.js
    end
  end

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
    params.require(:ingredient).permit(:name,
                                       :volume, :unit, :cost,
                                       :prep_method, :image,
                                       :cost_cents,
                                       :item_id, :quantity)
  end
end
