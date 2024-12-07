class Admin::CategoriesController < AdminController
  load_and_authorize_resource
  load_and_authorize_resource :organization
  load_and_authorize_resource :category, through: :organization  # Load the menu for the given organization

  decorates_assigned :categories, :category
  decorates_assigned :items

  # GET /items or /items.json
  def index
    @categories = @organization.categories

    # @items = @category.items
  end

  # GET /items/1 or /items/1.json
  def show
    # @items = @category.items
  end

  def sales_performance

  end

  private

  # Only allow a list of trusted parameters through.
  def categories_params
    full_attributes = %i[name status organization_id]

    params.require(:category).permit(full_attributes)
  end
end
