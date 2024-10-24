const Feature = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 mr-4">
      <div className="h-12 w-12 flex items-center justify-center bg-secondary text-highlight rounded-full">
        {icon}
      </div>
    </div>
    <div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-foreground">{description}</p>
    </div>
  </div>
);

export default Feature;
