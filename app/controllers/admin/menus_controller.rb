class Admin::MenusController < AdminController
  # before_action :set_menu
  # before_action :set_organization

  load_and_authorize_resource
  load_and_authorize_resource :item
  load_and_authorize_resource :organization
  load_and_authorize_resource :menu, through: :organization

  decorates_assigned :menus, :menu
  decorates_assigned :items, :best_five, :ranking_items, :categories, :ai_prompt_logs

  # GET /menus or /menus.json
  def index
    @menus = @organization.menus.includes(:items)
  end

  # GET /menus/1 or /menus/1.json
  def show
    # Eager load all associations needed to avoid N+1 queries
    # datasheet_lines is a has_many :through, so we need to include datasheet first
    # ingredient is needed for datasheet_line.calculated_price
    # order is needed for order_items.total_orders queries
    @items = @menu.items.includes(
      :category,
      datasheet: { datasheet_lines: :ingredient },
      order_items: :order
    ).order(:name)

    # Categories with their items and associations
    @categories = @menu.categories.includes(
      items: [:category, datasheet: { datasheet_lines: :ingredient }]
    ).order(:name)

    # Ranking items with associations for display
    @ranking_items = @menu.ranking_items.includes(:category)

    # Use already loaded items instead of a new query
    @best_five = @items.select { |item| item.status == true }.first(5)

    @import_job = current_organization.import_jobs.new

    # ABC Analysis
    @menu.perform_abc_analysis

    # Matrix Popularity
    @menu.categorize_menu_items
    # Reload matrix_category from database after update, then filter from loaded items
    # This avoids N+1 by using already loaded items with fresh matrix_category values
    item_ids = @items.map(&:id)
    matrix_categories = Item.where(id: item_ids).pluck(:id, :matrix_category).to_h
    @items.each { |item| item.matrix_category = matrix_categories[item.id] }
    @stars = @items.select { |item| item.matrix_category == 'star' }
    @plow_horses = @items.select { |item| item.matrix_category == 'plow_horse' }
    @puzzles = @items.select { |item| item.matrix_category == 'puzzle' }
    @dogs = @items.select { |item| item.matrix_category == 'dog' }

    # AI Assistant
    @recommendation_topics = AiRecommendationTopic.all.order(:name)
    @ai_prompt_logs = @menu.ai_prompt_logs
  end

  # GET /menus/new
  def new
    @menu = @organization.menus.new
    respond_to do |format|
      format.html
      format.js
    end
  end

  # GET /menus/1/edit
  def edit; end

  # POST /menus or /menus.json
  def create
    @menu = @organization.menus.new(menu_params)

    respond_to do |format|
      if @menu.save
        format.html { redirect_to admin_organization_menus_path(@organization), notice: 'Menu was successfully created.' }
        format.json { render :show, status: :created, location: @menu }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @menu.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /menus/1 or /menus/1.json
  def update
    respond_to do |format|
      if @menu.update(menu_params)
        format.html { redirect_to admin_organization_menus_path(@organization), notice: 'Menu was successfully updated.' }
        format.json { render :show, status: :ok, location: @menu }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @menu.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /menus/1 or /menus/1.json
  def destroy
    @organization = @menu.organization
    @menu.destroy

    respond_to do |format|
      format.html { redirect_to admin_organization_menus_path(@organization), notice: 'Menu was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Only allow a list of trusted parameters through.
  def menu_params
    params.require(:menu).permit(:name, :description, :release_date, :data_imported,
                                 :status, :organization_id)
  end
end
