# app/services/file_parser_service.rb
class FileParserService
  def initialize(file)
    @file = file
    @file_path = file&.file
  end

  ##
  # Return the records objects to be created in Worker
  # @return Object[]
  def parse(object_type = nil)
    case object_type
    when :menu
      name, result = MenuParserService.new(@file).parse
    when :item
      name, result = ItemParserService.new(@file).parse
    when :order
      name, result = OrderParserService.new(@file).parse
    end

    [name, result]
  end
end
