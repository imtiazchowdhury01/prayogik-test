import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CardItem {
  title: string;
  description: string;
  link: string;
  buttonText?: string;
}

interface AboutCtaProps {
  cards: CardItem[];
  maxWidth?: string;
  columns?: string;
  gap?: string;
  cardClassName?: string;
  buttonClassName?: string;
  buttonText?: string;
}

const AboutCta: React.FC<AboutCtaProps> = ({
  cards,
  maxWidth = "md:max-w-4xl max-w-7xl",
  columns = "md:grid-cols-2 grid-cols-1",
  gap = "gap-6",
  cardClassName = "bg-brand/5",
  buttonClassName = "bg-secondary-button font-semibold text-base md:max-w-fit max-w-full transition-all duration-300 hover:bg-secondary-button hover:opacity-85 py-4 h-12 max-auto",
  buttonText = "",
}) => {
  return (
    <section className={`${maxWidth} px-6 xl:px-0 mx-auto`}>
      <div className={`grid ${columns} ${gap}`}>
        {cards.map((card, index) => (
          <CardItem
            key={index}
            className={cardClassName}
            title={card.title}
            description={card.description}
            link={card.link}
            buttonClassName={buttonClassName}
            buttonText={card.buttonText || buttonText}
          />
        ))}
      </div>
    </section>
  );
};

interface CardItemProps {
  className?: string;
  title: string;
  description: string;
  link: string;
  buttonClassName?: string;
  buttonText: string;
}

const CardItem: React.FC<CardItemProps> = ({
  className,
  title,
  description,
  link,
  buttonClassName,
  buttonText,
}) => {
  return (
    <Card className={`p-6 border-gray-200/55 ${className}`}>
      <CardContent className="p-0 flex flex-col h-full text-center">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className=" text-muted-foreground mb-6 flex-grow">{description}</p>
        <div className="flex justify-center items-center">
          <Button asChild className={`${buttonClassName}`}>
            <Link href={link}>{buttonText}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutCta;
