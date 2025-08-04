import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create some test users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'mystery_hunter',
        email: 'hunter@unknown.com',
        passwordHash: await hash('password123', 12),
        profile: {
          create: {
            displayName: 'Mystery Hunter',
            bio: 'Passionate about uncovering the unknown. Investigating mysteries since 2010.',
            interests: ['UFOs', 'Cryptids', 'Ancient Mysteries'],
            mysteryScore: 450,
            verified: true,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: 'paranormal_researcher',
        email: 'researcher@unknown.com',
        passwordHash: await hash('password123', 12),
        profile: {
          create: {
            displayName: 'Dr. Sarah Chen',
            bio: 'Paranormal researcher and author. PhD in Anomalous Phenomena Studies.',
            location: 'Portland, OR',
            interests: [
              'Paranormal',
              'Scientific Anomalies',
              'Unexplained Events',
            ],
            mysteryScore: 1250,
            verified: true,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: 'truth_seeker',
        email: 'seeker@unknown.com',
        passwordHash: await hash('password123', 12),
        profile: {
          create: {
            displayName: 'Truth Seeker',
            bio: 'Seeking truth in a world full of mysteries.',
            interests: [
              'Conspiracies',
              'Historical Mysteries',
              'Internet Mysteries',
            ],
            mysteryScore: 320,
          },
        },
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create some categories/tags
  const tags = await Promise.all([
    prisma.tag.create({
      data: {
        name: 'UFO',
        slug: 'ufo',
        description: 'Unidentified Flying Objects and related phenomena',
        usageCount: 45,
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Bigfoot',
        slug: 'bigfoot',
        description: 'Bigfoot and Sasquatch sightings',
        usageCount: 23,
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Ancient Technology',
        slug: 'ancient-technology',
        description: 'Unexplained ancient artifacts and technology',
        usageCount: 31,
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Internet Mystery',
        slug: 'internet-mystery',
        description: 'Mysteries originating from the internet',
        usageCount: 67,
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Disappearance',
        slug: 'disappearance',
        description: 'Mysterious disappearances of people or objects',
        usageCount: 89,
      },
    }),
  ]);

  console.log(`✅ Created ${tags.length} tags`);

  // Create some sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'The Mystery of the Antikythera Mechanism',
        content: `The Antikythera mechanism is an ancient Greek analog computer used to predict astronomical positions and eclipses for calendar and astrological purposes. It was discovered in 1901 in the Antikythera wreck off the Greek island of Antikythera.

The device has been dated to approximately 87 BC, making it over 2,000 years old. What makes this discovery so remarkable is the level of sophistication and complexity that wasn't seen again until the 14th century.

Recent studies using advanced imaging techniques have revealed that the mechanism contained at least 37 meshing bronze gears, and possibly as many as 72. The precision required to create such a device challenges our understanding of ancient Greek technological capabilities.

Who built this incredible machine? How did they possess such advanced knowledge of astronomy and engineering? The Antikythera mechanism continues to baffle researchers and remains one of history's greatest technological mysteries.`,
        contentType: 'TEXT',
        category: 'HISTORICAL_MYSTERIES',
        authorId: users[1].id,
        mysteryStatus: 'PARTIALLY_SOLVED',
        views: 234,
        tags: {
          create: [{ tagId: tags[2].id }],
        },
      },
    }),
    prisma.post.create({
      data: {
        title: "Cicada 3301: The Internet's Greatest Mystery",
        content: `On January 4, 2012, a mysterious image appeared on 4chan's /b/ board. The image contained a simple message: "Hello. We are looking for highly intelligent individuals. To find them, we have devised a test."

This marked the beginning of what would become known as Cicada 3301, one of the most elaborate and complex puzzle series ever created on the internet. The puzzles incorporated cryptography, steganography, literature, art, and philosophy.

The challenges led participants across the globe, from digital clues hidden in images to physical locations in countries around the world. QR codes appeared on telephone poles in major cities, books were hidden in libraries, and complex ciphers required advanced mathematical knowledge to solve.

Despite thousands of people working together to solve the puzzles, the identity and purpose of Cicada 3301 remains unknown. Some speculate it was a recruitment tool for intelligence agencies, while others believe it was created by a secret society or advanced hacker collective.

The last confirmed Cicada 3301 puzzle appeared in 2016, but the mystery lives on. Who created these elaborate puzzles, and what was their ultimate purpose?`,
        contentType: 'TEXT',
        category: 'INTERNET_MYSTERIES',
        authorId: users[0].id,
        mysteryStatus: 'UNSOLVED',
        views: 1247,
        featured: true,
        tags: {
          create: [{ tagId: tags[3].id }],
        },
      },
    }),
    prisma.post.create({
      data: {
        title: 'The Patterson-Gimlin Film: Evidence of Bigfoot?',
        content: `On October 20, 1967, Roger Patterson and Bob Gimlin captured what remains the most famous piece of alleged Bigfoot footage in history. The 59.5-second film shows a large, dark, hairy, ape-like creature walking through a clearing in Northern California.

The creature, which has been dubbed "Patty," appears to be female based on visible anatomical features. The film shows the creature walking with a distinctive gait, occasionally looking back at the camera before disappearing into the forest.

For over 50 years, this footage has been analyzed by scientists, filmmakers, and cryptozoologists. Some argue that the creature's proportions, muscle movement, and gait are consistent with an unknown primate species. Others maintain it's an elaborate hoax involving a person in a costume.

Recent digital enhancements and biomechanical analyses have yielded mixed results. While some experts point to evidence suggesting authenticity, others highlight inconsistencies that support the hoax theory.

The debate continues: Is the Patterson-Gimlin film genuine evidence of an unknown species, or one of the most successful hoaxes in history?`,
        contentType: 'TEXT',
        category: 'CRYPTIDS',
        authorId: users[2].id,
        mysteryStatus: 'UNSOLVED',
        views: 567,
        tags: {
          create: [{ tagId: tags[1].id }],
        },
      },
    }),
    prisma.post.create({
      data: {
        title: 'The Disappearance of Flight MH370',
        content: `On March 8, 2014, Malaysia Airlines Flight MH370 disappeared while flying from Kuala Lumpur to Beijing. The Boeing 777-200ER, carrying 239 people, vanished from radar approximately one hour after takeoff.

The aircraft's transponder was manually turned off, and the plane deviated from its planned route, flying for several more hours before eventually crashing somewhere in the southern Indian Ocean. Despite being one of the most extensive and expensive search operations in aviation history, the main wreckage has never been found.

Several pieces of debris have washed ashore on islands in the western Indian Ocean, confirming that the aircraft crashed into the ocean. However, the lack of the main wreckage means that crucial questions remain unanswered.

What caused MH370 to deviate from its course? Was it pilot suicide, hijacking, mechanical failure, or something else entirely? Why were the communication systems turned off? Where exactly did the plane crash?

The disappearance of MH370 remains one of the greatest aviation mysteries of all time, spawning countless theories and investigations but few definitive answers.`,
        contentType: 'TEXT',
        category: 'UNEXPLAINED_EVENTS',
        authorId: users[1].id,
        mysteryStatus: 'UNSOLVED',
        views: 892,
        tags: {
          create: [{ tagId: tags[4].id }],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} posts`);

  // Add some likes and comments
  await Promise.all([
    prisma.like.create({
      data: {
        userId: users[0].id,
        postId: posts[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: users[2].id,
        postId: posts[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: users[1].id,
        postId: posts[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Fascinating! The level of precision in ancient times never ceases to amaze me.',
        authorId: users[0].id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content:
          "I've been following Cicada 3301 since the beginning. Still gives me chills.",
        authorId: users[2].id,
        postId: posts[1].id,
      },
    }),
  ]);

  console.log('✅ Created likes and comments');

  // Create some follows
  await Promise.all([
    prisma.follow.create({
      data: {
        followerId: users[0].id,
        followingId: users[1].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[2].id,
        followingId: users[1].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[1].id,
        followingId: users[0].id,
      },
    }),
  ]);

  console.log('✅ Created follow relationships');

  console.log('🌱 Seed completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
